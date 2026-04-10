import { Component } from '@angular/core';
import { AnalysisService } from '../../../services/analysis-service';

@Component({
  selector: 'app-heatmap-overlay',
  standalone: true,
  templateUrl: './heatmap-overlay.html',
  styleUrl: './heatmap-overlay.scss',
})
export class HeatmapOverlay {
  readonly originalUrl: string;
  readonly heatmapUrl: string;

  constructor(private analysis: AnalysisService) {
    this.originalUrl = this.analysis.getOriginalImageUrl();
    this.heatmapUrl = this.analysis.getHeatmapUrl();
  }
}