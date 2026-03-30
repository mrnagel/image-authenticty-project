import { Component, Input, OnChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

export interface ModelResult {
  p_fake: number;
  p_real: number;
}

@Component({
  selector: 'app-binary-entropy-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './binary-entropy-chart.html',
  styleUrl: './binary-entropy-chart.scss',
})
export class BinaryEntropyChart implements OnChanges {
  @Input() results: Record<string, ModelResult> = {};

  chartData: any;
  chartOptions: any;

  ngOnChanges(): void {
    this.buildChart();
  }

  private confidence(p: number): number {
    if (p === 0 || p === 1) return 1;
    return 1 - (-p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
  }

  private buildChart(): void {
    const steps = 200;
    const xs = Array.from({ length: steps + 1 }, (_, i) => i / steps);

    const modelColors: Record<string, string> = {
      trufor: '#6366f1',
      bfree: '#22c55e',
      dda: '#f59e0b',
    };

    const scatterDatasets = Object.entries(this.results).map(([name, r]) => ({
      type: 'scatter',
      label: name,
      data: [{ x: r.p_fake, y: this.confidence(r.p_fake) }],
      backgroundColor: modelColors[name] ?? '#94a3b8',
      pointRadius: 7,
      pointHoverRadius: 9,
      hitRadius: 7,
    }));

    this.chartData = {
      labels: xs.map((x) => x.toFixed(2)),
      datasets: [
        {
          type: 'line',
          data: xs.map((x) => ({ x, y: this.confidence(x) })),
          borderColor: '#94a3b8',
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        },
        ...scatterDatasets,
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: { filter: (item: any) => item.datasetIndex !== 0 },
        },
        tooltip: {
          callbacks: {
            title: (items: any[]) => {
              const item = items[0];
              if (item?.dataset.type === 'scatter') {
                return `p(fake) = ${item.parsed.x.toFixed(3)}`;
              }
              return '';
            },
            label: (ctx: any) => {
              if (ctx.dataset.type === 'scatter') {
                const label = ctx.parsed.x > 0.5 ? 'fake' : 'authentic';
                return `${ctx.dataset.label}: ${(ctx.parsed.y * 100).toFixed(1)}% confident ${label}`;
              }
              return '';
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 1,
          title: { display: true, text: 'p(fake)' },
        },
        y: {
          min: 0,
          max: 1,
          title: { display: true, text: 'Model Confidence ( 1 - H(p(fake)) )' },
        },
      },
    };
  }
}
