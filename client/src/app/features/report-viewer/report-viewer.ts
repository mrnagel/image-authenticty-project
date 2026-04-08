import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Job } from '../../services/analysis-service';
import { BinaryEntropyChart, ModelResult } from './binary-entropy-chart/binary-entropy-chart';
import { HeatmapOverlay } from './heatmap-overlay/heatmap-overlay';
import { ButtonModule } from 'primeng/button';

export interface Predictions {
  prediction: boolean;
  confidence: number;
}

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [BinaryEntropyChart, HeatmapOverlay, ButtonModule],
  templateUrl: './report-viewer.html',
  styleUrl: './report-viewer.scss',
})
export class ReportViewer implements OnChanges {
  @Input() job?: Job;
  @Output() newAnalysis = new EventEmitter<void>();

  results: Record<string, ModelResult> = {};
  predictions?: Predictions;

  ngOnChanges(): void {
    if (this.job?.result) {
      const parsed = JSON.parse(this.job.result);
      this.predictions = parsed['predictions'];
      const { predictions: _, ...modelResults } = parsed;
      this.results = modelResults;
    }
  }

  exportPdf(): void {
    window.print();
  }
}