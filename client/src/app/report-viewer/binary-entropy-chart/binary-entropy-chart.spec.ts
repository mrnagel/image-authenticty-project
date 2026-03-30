import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BinaryEntropyChart } from './binary-entropy-chart';

describe('BinaryEntropyChart', () => {
  let component: BinaryEntropyChart;
  let fixture: ComponentFixture<BinaryEntropyChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinaryEntropyChart],
    }).compileComponents();

    fixture = TestBed.createComponent(BinaryEntropyChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
