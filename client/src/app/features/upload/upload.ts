import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AnalysisService, Job } from '../../services/analysis-service';
import { ReportViewer } from '../../report-viewer/report-viewer';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ BadgeModule, ButtonModule, FileUploadModule, ProgressBarModule, ReportViewer],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  job?: Job;
  pollingSub?: Subscription;

  get badgeSeverity(): 'success' | 'danger' | 'info' | 'warn' {
    switch (this.job?.status) {
      case 'completed': return 'success';
      case 'failed':    return 'danger';
      case 'running':   return 'info';
      default:          return 'warn';
    }
  }
  
  constructor(private analysis: AnalysisService, private cdr: ChangeDetectorRef) {}

  onUpload(event: any) {
    const file: File | undefined = event?.files?.[0];
    if (!file) return;

    this.analysis.uploadImage(file).subscribe((job) => {
      this.job = job;

      //if user uploaded image previously for some reason, cancel that poll subscription
      this.pollingSub?.unsubscribe();
      this.pollingSub = this.analysis.pollJob(job.jobId, 2000).subscribe((updatedJob) => {
        this.job = updatedJob;
        this.fileUpload.cd.detectChanges();
        this.cdr.detectChanges();
        console.log('job update', updatedJob)
      });
    });
    
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }
}
