import { Component } from '@angular/core';

@Component({
  selector: 'app-heatmap-overlay',
  standalone: true,
  templateUrl: './heatmap-overlay.html',
  styleUrl: './heatmap-overlay.scss',
})
export class HeatmapOverlay {
  readonly originalUrl = 'http://localhost:8000/original-image';
  readonly heatmapUrl = 'http://localhost:8000/heatmap';
}