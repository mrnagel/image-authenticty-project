import { Component, Input, OnChanges } from '@angular/core';
import { Job } from '../services/analysis-service';
import { BinaryEntropyChart, ModelResult } from './binary-entropy-chart/binary-entropy-chart';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [BinaryEntropyChart],
  templateUrl: './report-viewer.html',
  styleUrl: './report-viewer.scss',
})
export class ReportViewer implements OnChanges {
  @Input() job?: Job;

  results: Record<string, ModelResult> = {};

  ngOnChanges(): void {
    if (this.job?.result) {
      this.results = JSON.parse(this.job.result);
    }
  }
}
