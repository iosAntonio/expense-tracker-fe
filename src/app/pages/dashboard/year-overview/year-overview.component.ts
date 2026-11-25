import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MonthSummary } from '../../../core/expense-stats';

interface MonthBar extends MonthSummary {
  label: string;
  shortLabel: string;
  height: number;
  description: string;
}

const longMonth = new Intl.DateTimeFormat('it-IT', { month: 'long' });
const shortMonth = new Intl.DateTimeFormat('it-IT', { month: 'short' });
const currency = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

@Component({
  selector: 'app-year-overview',
  templateUrl: './year-overview.component.html',
  styleUrls: ['./year-overview.component.scss'],
})
export class YearOverviewComponent implements OnChanges {
  @Input() year = new Date().getFullYear();
  @Input() months: MonthSummary[] = [];
  @Input() selectedMonth: number | null = null;

  @Output() monthSelected = new EventEmitter<number>();

  bars: MonthBar[] = [];
  total = 0;
  monthsWithExpenses = 0;
  average = 0;
  topMonth: MonthBar | null = null;

  ngOnChanges(): void {
    const highest = Math.max(0, ...this.months.map(month => month.total));

    this.bars = this.months.map(month => {
      const date = new Date(this.year, month.month - 1, 1);
      const label = longMonth.format(date);
      const expenses = month.count === 1 ? '1 spesa' : `${month.count} spese`;

      return {
        ...month,
        label,
        shortLabel: shortMonth.format(date).replace('.', ''),
        height: month.total > 0 ? Math.max(3, (month.total / highest) * 100) : 0,
        description:
          month.count === 0
            ? `${label} ${this.year}: nessuna spesa`
            : `${label} ${this.year}: ${currency.format(month.total)}, ${expenses}`,
      };
    });

    const withExpenses = this.bars.filter(bar => bar.count > 0);
    this.total = withExpenses.reduce((sum, bar) => sum + bar.total, 0);
    this.monthsWithExpenses = withExpenses.length;
    this.average = withExpenses.length > 0 ? this.total / withExpenses.length : 0;
    this.topMonth = withExpenses.reduce<MonthBar | null>(
      (top, bar) => (!top || bar.total > top.total ? bar : top),
      null
    );
  }

  formatEUR(value: number): string {
    return currency.format(value);
  }

  trackMonth(_index: number, bar: MonthBar): string {
    return bar.key;
  }
}
