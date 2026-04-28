import { Component, Input, OnChanges, ViewChild } from '@angular/core';
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
  @Input() avgPFake?: number;

  @ViewChild('chartRef') chartRef: any;

  chartData: any;
  chartOptions: any;

  ngOnChanges(): void {
    this.buildChart();
  }
  //change average marker to black for print contrast, then restore after printing
  prepareForPrint(): void {
    this.setAvgColor('#000000');
  }
  restoreFromPrint(): void {
    this.setAvgColor('#ffffff');
  }
  private setAvgColor(color: string): void {
    const chart= this.chartRef?.chart;
    if (!chart) return;
    const avgDataset=chart.data.datasets.find((d: any) => d.label === 'Average');
    if (!avgDataset) return;
    avgDataset.borderColor =color;
    chart.update('none');
  }

  // binary entropy confidence is 1-H(p), doesn't include where log2 is undefined
  private confidence(p: number): number {
    if (p === 0 || p === 1) return 1;
    return 1 - (-p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
  }

  //generate 200 x values spaced from 0 to 1 to plot entropy curve
  private buildChart(): void {
    const steps = 200;
    const xs = Array.from({ length: steps + 1 }, (_, i) => i / steps);

    const modelColors: Record<string, string> = {
      trufor: '#6366f1',
      bfree: '#22c55e',
      dda: '#f59e0b',
    };

    // each model's p_fake score gets plotted as a point on the curve
    const scatterDatasets = Object.entries(this.results).map(([name, r]) => ({
      type: 'scatter',
      label: name,
      data: [{ x: r.p_fake, y: this.confidence(r.p_fake) }],
      backgroundColor: modelColors[name] ??'#94a3b8',
      pointRadius: 7,
      pointHoverRadius: 9,
      hitRadius: 7,
    }));

    const avgDataset = this.avgPFake != null ? [{
      type: 'scatter',
      label: 'Average',
      data: [{x:this.avgPFake, y:this.confidence(this.avgPFake) }],
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      borderWidth: 2,
      pointStyle: 'crossRot',
      pointRadius: 10,
      pointHoverRadius: 12,
      hitRadius: 10,
    }]:[];

    //use line dataset to draw entropy curve, overlay model predictions w/ scatter dataset
    this.chartData = {
      labels: xs.map((x) => x.toFixed(2)),
      datasets: [
        {
          type: 'line',
          data: xs.map((x) => ({ x, y: this.confidence(x)})),
          borderColor: '#94a3b8',
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        },
        ...scatterDatasets,
        ...avgDataset,
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',

          //exclude entropy curve line from legend
          labels: { filter: (item: any) => item.datasetIndex !== 0, usePointStyle: true },
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
