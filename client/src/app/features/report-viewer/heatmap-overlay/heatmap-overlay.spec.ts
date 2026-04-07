import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapOverlay } from './heatmap-overlay';

describe('HeatmapOverlay', () => {
  let component: HeatmapOverlay;
  let fixture: ComponentFixture<HeatmapOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatmapOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
