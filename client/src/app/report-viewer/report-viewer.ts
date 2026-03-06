import { Component, Input } from '@angular/core';
import { Job } from '../services/analysis-service';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  templateUrl: './report-viewer.html',
  styleUrl: './report-viewer.scss',
})
export class ReportViewer {
  @Input() job?: Job;
}
