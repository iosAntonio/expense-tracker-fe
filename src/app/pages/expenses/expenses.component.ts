import { Component, OnInit } from '@angular/core';
import {
  ExpenseService,
  ExpenseResponse,
} from '../../services/expense.service';

interface ExpenseCategory {
  key: string;
  name: string;
  emoji: string;
  color: string;
  total: number;
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
  expenses: ExpenseResponse[] = [];

  isLoading = true;
  errorMessage: string | null = null;

  readonly projectStart = new Date(2026, 9, 1);

  selectedMonth = this.getInitialSelectedMonth();
  selectedCategory = 'ALL';
  searchTerm = '';

  // Corrispondenza tra enum backend e categorie visualizzate.
  private readonly categoryDefinitions = [
    {
      key: 'ALIMENTARI',
      name: 'Spesa & Alimentari',
      emoji: '🛒',
      color: '#10b981',
    },
    {
      key: 'BAR_RISTORAZIONE',
      name: 'Bar e Ristoranti',
      emoji: '🍽️',
      color: '#8b5cf6',
    },
    { key: 'CASA', name: 'Casa & Utenze', emoji: '🏠', color: '#3b82f6' },
    { key: 'AUTO', name: 'Auto', emoji: '🚗', color: '#f59e0b' },
    { key: 'TRASPORTI', name: 'Trasporti', emoji: '🚆', color: '#6366f1' },
    { key: 'VIAGGI', name: 'Viaggi', emoji: '✈️', color: '#6366f1' },
    { key: 'SPORT', name: 'Sport', emoji: '🏐', color: '#14b8a6' },
    { key: 'SVAGO', name: 'Svago', emoji: '🎟️', color: '#8b5cf6' },
    { key: 'SHOPPING', name: 'Shopping', emoji: '🛍️', color: '#ec4899' },
    { key: 'SALUTE', name: 'Salute', emoji: '💊', color: '#ef4444' },
    { key: 'ALTRO', name: 'Altro', emoji: '📦', color: '#a1a1aa' },
  ];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  private loadExpenses(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.expenseService.getAllExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore durante il caricamento delle spese:', error);
        this.errorMessage =
          'Non è stato possibile caricare le spese. Riprova più tardi.';
        this.isLoading = false;
      },
    });
  }

  private getInitialSelectedMonth(): string {
    const today = new Date();
    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );

    const selectedDate =
      previousMonth < this.projectStart ? this.projectStart : previousMonth;

    return this.toMonthKey(selectedDate);
  }

  private toMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }

  get currentMonth(): string {
    return this.toMonthKey(new Date());
  }

  get monthOptions(): { value: string; label: string }[] {
    const options: { value: string; label: string }[] = [];
    const today = new Date();

    const cursor = new Date(
      this.projectStart.getFullYear(),
      this.projectStart.getMonth(),
      1,
    );

    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    while (cursor <= lastMonth) {
      options.push({
        value: this.toMonthKey(cursor),
        label: new Intl.DateTimeFormat('it-IT', {
          month: 'long',
          year: 'numeric',
        }).format(cursor),
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return options;
  }

  get selectedMonthLabel(): string {
    const [year, month] = this.selectedMonth.split('-').map(Number);

    return new Intl.DateTimeFormat('it-IT', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month - 1, 1));
  }

  get canGoPrevious(): boolean {
    return this.selectedMonth > this.toMonthKey(this.projectStart);
  }

  get canGoNext(): boolean {
    return this.selectedMonth < this.currentMonth;
  }

  goToPreviousMonth(): void {
    if (!this.canGoPrevious) {
      return;
    }

    const [year, month] = this.selectedMonth.split('-').map(Number);
    this.selectedMonth = this.toMonthKey(new Date(year, month - 2, 1));
  }

  goToNextMonth(): void {
    if (!this.canGoNext) {
      return;
    }

    const [year, month] = this.selectedMonth.split('-').map(Number);
    this.selectedMonth = this.toMonthKey(new Date(year, month, 1));
  }

  get monthlyTransactions(): ExpenseResponse[] {
    return this.expenses.filter(
      (expense) => expense.date.substring(0, 7) === this.selectedMonth,
    );
  }

  get filteredTransactions(): ExpenseResponse[] {
    const search = this.searchTerm.trim().toLocaleLowerCase('it-IT');

    return this.monthlyTransactions
      .filter((expense) => {
        const matchesCategory =
          this.selectedCategory === 'ALL' ||
          expense.category === this.selectedCategory;

        const formattedDate = this.formatDate(expense.date).toLocaleLowerCase(
          'it-IT',
        );

        const matchesSearch =
          (expense.description ?? '')
            .toLocaleLowerCase('it-IT')
            .includes(search) ||
          formattedDate.includes(search) ||
          expense.date.includes(search);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }

  get totalExpenses(): number {
    return this.monthlyTransactions.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
  }

  get filteredTotal(): number {
    return this.filteredTransactions.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
  }

  get categories(): ExpenseCategory[] {
    return this.categoryDefinitions.map((category) => ({
      ...category,
      total: this.monthlyTransactions
        .filter((expense) => expense.category === category.key)
        .reduce((total, expense) => total + expense.amount, 0),
    }));
  }

  get chartGradient(): string {
    if (this.totalExpenses === 0) {
      return 'conic-gradient(var(--color-border) 0% 100%)';
    }

    let position = 0;

    const segments = this.categories
      .filter((category) => category.total > 0)
      .map((category) => {
        const start = position;
        position += (category.total / this.totalExpenses) * 100;

        return `${category.color} ${start}% ${position}%`;
      });

    return `conic-gradient(${segments.join(', ')})`;
  }

  percentage(category: ExpenseCategory): string {
    if (this.totalExpenses === 0) {
      return '0.0';
    }

    return ((category.total / this.totalExpenses) * 100).toFixed(1);
  }

  categoryFor(key: string): ExpenseCategory | undefined {
    return this.categories.find((category) => category.key === key);
  }

  formatEUR(value: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);

    return new Intl.DateTimeFormat('it-IT').format(
      new Date(year, month - 1, day),
    );
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }
}
