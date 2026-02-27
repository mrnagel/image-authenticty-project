import { Component } from '@angular/core';
import { AnalysisService, Job } from '../../services/analysis-service';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ ButtonModule, FileUploadModule, ProgressBarModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {
  job?: Job;
  pollingSub?:Subscription;
  
  constructor(private analysis: AnalysisService) {}

  onUpload(event: any) {
    const file: File | undefined = event?.files?.[0];
    if (!file) return;

    this.analysis.uploadImage(file).subscribe((job) => {
      this.job = job;

      //if user uploaded image previously for some reason, cancel that poll subscription
      this.pollingSub?.unsubscribe();
      this.pollingSub = this.analysis.pollJob(job.jobId, 2000).subscribe((updatedJob) => {
        this.job = updatedJob;
        console.log('job update', updatedJob)
      });
    });
    
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }
}
