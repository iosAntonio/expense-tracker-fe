import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthSummary } from '../../../core/expense-stats';
import { YearOverviewComponent } from './year-overview.component';

function eur(value: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
}

function months(totals: number[], counts: number[]): MonthSummary[] {
  return totals.map((total, index) => ({
    month: index + 1,
    key: `2025-${String(index + 1).padStart(2, '0')}`,
    total,
    count: counts[index],
  }));
}

describe('YearOverviewComponent', () => {
  let fixture: ComponentFixture<YearOverviewComponent>;
  let component: YearOverviewComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YearOverviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  function render(data: MonthSummary[], selectedMonth: number | null = null): void {
    component.year = 2025;
    component.months = data;
    component.selectedMonth = selectedMonth;
    component.ngOnChanges();
    fixture.detectChanges();
  }

  function bars(): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll('.month-bar'));
  }

  const year2025 = months(
    [105, 0, 0, 0, 0, 0, 0, 320, 0, 70, 0, 90],
    [2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1]
  );

  it('draws the twelve months, scaled to the most expensive one', () => {
    render(year2025);

    expect(bars().length).toBe(12);
    expect(bars().map(bar => bar.querySelector('.bar-label')?.textContent?.trim())).toEqual([
      'gen',
      'feb',
      'mar',
      'apr',
      'mag',
      'giu',
      'lug',
      'ago',
      'set',
      'ott',
      'nov',
      'dic',
    ]);
    const heights = bars().map(bar => (bar.querySelector('.bar-fill') as HTMLElement).style.height);
    expect(heights[7]).toBe('100%');
    expect(parseFloat(heights[0])).toBeCloseTo((105 / 320) * 100, 1);
    expect(heights[1]).toBe('0%');
    expect(bars()[1].classList).toContain('empty');
  });

  it('sums up the year: total, average of the months with expenses and highest month', () => {
    render(year2025);

    const summary = element.querySelector('.overview-summary')?.textContent ?? '';
    expect(summary).toContain(eur(585));
    expect(summary).toContain(eur(146.25));
    expect(summary).toContain(`agosto, ${eur(320)}`);
    expect(bars()[7].getAttribute('aria-label')).toBe(`agosto 2025: ${eur(320)}, 1 spesa`);
    expect(bars()[1].getAttribute('aria-label')).toBe('febbraio 2025: nessuna spesa');
  });

  it('highlights the selected month and reports clicks', () => {
    render(year2025, 10);
    const clicked: number[] = [];
    component.monthSelected.subscribe(month => clicked.push(month));

    expect(bars()[9].getAttribute('aria-pressed')).toBe('true');
    expect(bars()[9].classList).toContain('selected');
    expect(bars()[0].getAttribute('aria-pressed')).toBe('false');

    bars()[0].click();
    expect(clicked).toEqual([1]);
  });

  it('says so when the year has no expenses', () => {
    render(months(new Array(12).fill(0), new Array(12).fill(0)));

    expect(element.textContent).toContain('Nessuna spesa registrata nel 2025.');
    expect(bars().length).toBe(12);
  });
});
