import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Job } from '../../services/analysis-service';
import { BinaryEntropyChart, ModelResult } from './binary-entropy-chart/binary-entropy-chart';
import { HeatmapOverlay } from './heatmap-overlay/heatmap-overlay';
import { ButtonModule } from 'primeng/button';

export interface Predictions {
  prediction: boolean;
  confidence: number;
}
export interface ModelMetric {
  name: string;
  pFake: number;
  confidence: number;
  verdict: 'fake' | 'authentic';
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
  @ViewChild(BinaryEntropyChart) entropyChart?: BinaryEntropyChart;

  results: Record<string, ModelResult> = {};
  predictions?: Predictions;
  modelMetrics: ModelMetric[] = [];
  avgPFake?: number;
  avgConfidence?: number;
  avgVerdict?: 'fake' | 'authentic';

  ngOnChanges(): void {
    if (this.job?.result) {
      const parsed = JSON.parse(this.job.result);
      this.predictions = parsed['predictions'];
      const { predictions: _, ...modelResults } = parsed;
      this.results = modelResults;
      this.modelMetrics = Object.entries(this.results as Record<string, ModelResult>).map(([name, r]) => ({
        name,
        pFake: r.p_fake,
        confidence: this.entropy(r.p_fake),
        verdict:r.p_fake > 0.5 ? 'fake':'authentic',
      }));

      const values = this.modelMetrics.map(m => m.pFake);

      this.avgPFake = values.reduce((a, b) => a + b, 0) / values.length;
      this.avgConfidence = this.entropy(this.avgPFake);
      this.avgVerdict = this.avgPFake > 0.5 ? 'fake' : 'authentic';
    }
  }
  private entropy(p: number): number {
    if (p==0||p== 1) return 1;
    return 1 -(-p* Math.log2(p) - (1 - p) *Math.log2(1 - p));
  }

  exportPdf(): void {
    this.entropyChart?.prepareForPrint();
    window.print();
    this.entropyChart?.restoreFromPrint();
  }
}