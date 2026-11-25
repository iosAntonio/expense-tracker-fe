import { Component, OnInit } from '@angular/core';

import {
  CategoryTotal,
  MonthSummary,
  categoryTotals,
  monthlyTotals,
  sumAmounts,
  yearOf,
  yearRange,
} from '../../core/expense-stats';
import { ExpenseResponse, ExpenseService } from '../../services/expense.service';

const EMPTY_RING = 'conic-gradient(var(--color-border) 0% 100%)';
const currency = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
const percent = new Intl.NumberFormat('it-IT', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const monthAndYear = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  errorMessage: string | null = null;

  selectedYear = new Date().getFullYear();
  selectedMonth: number | null = null;

  years: number[] = [this.selectedYear];
  yearMonths: MonthSummary[] = monthlyTotals([], this.selectedYear);
  categoryTotals: CategoryTotal[] = [];
  periodTotal = 0;
  chartGradient = EMPTY_RING;

  private expenses: ExpenseResponse[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: expenses => {
        this.expenses = expenses;
        this.selectedYear = this.defaultYear();
        this.refresh();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Non è stato possibile caricare le spese. Riprova più tardi.';
        this.isLoading = false;
      },
    });
  }

  get periodLabel(): string {
    return this.selectedMonth === null
      ? String(this.selectedYear)
      : monthAndYear.format(new Date(this.selectedYear, this.selectedMonth - 1, 1));
  }

  get emptyMessage(): string {
    return this.selectedMonth === null
      ? `Nessuna spesa registrata nel ${this.periodLabel}.`
      : `Nessuna spesa registrata per ${this.periodLabel}.`;
  }

  get donutDescription(): string {
    if (this.categoryTotals.length === 0) {
      return this.emptyMessage;
    }

    const parts = this.categoryTotals.map(
      category => `${category.name} ${this.formatPercent(category.share)}`
    );

    return `Ripartizione delle spese di ${this.periodLabel} per categoria: ${parts.join(', ')}`;
  }

  selectYear(year: number): void {
    this.selectedYear = year;
    this.selectedMonth = null;
    this.refresh();
  }

  toggleMonth(month: number): void {
    this.selectedMonth = this.selectedMonth === month ? null : month;
    this.refresh();
  }

  showWholeYear(): void {
    this.selectedMonth = null;
    this.refresh();
  }

  formatEUR(value: number): string {
    return currency.format(value);
  }

  formatPercent(share: number): string {
    return percent.format(share);
  }

  trackCategory(_index: number, category: CategoryTotal): string {
    return category.key;
  }

  private defaultYear(): number {
    const currentYear = new Date().getFullYear();
    const years = this.expenses.map(yearOf);

    return years.length === 0 || years.includes(currentYear) ? currentYear : Math.max(...years);
  }

  private refresh(): void {
    const prefix =
      this.selectedMonth === null
        ? `${this.selectedYear}-`
        : `${this.selectedYear}-${String(this.selectedMonth).padStart(2, '0')}-`;
    const periodExpenses = this.expenses.filter(expense => expense.date.startsWith(prefix));

    this.years = yearRange(this.expenses, [this.selectedYear, new Date().getFullYear()]);
    this.yearMonths = monthlyTotals(this.expenses, this.selectedYear);
    this.periodTotal = sumAmounts(periodExpenses);
    this.categoryTotals = categoryTotals(periodExpenses);
    this.chartGradient = this.buildGradient();
  }

  private buildGradient(): string {
    if (this.categoryTotals.length === 0) {
      return EMPTY_RING;
    }

    let position = 0;
    const last = this.categoryTotals.length - 1;
    const segments = this.categoryTotals.map((category, index) => {
      const start = position;
      position = index === last ? 100 : position + category.share * 100;

      return `${category.color} ${start}% ${position}%`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }
}
