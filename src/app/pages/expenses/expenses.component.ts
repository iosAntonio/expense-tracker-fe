import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import {
  ExpenseService,
  ExpenseResponse,
  ExpenseUpdateRequest,
} from '../../services/expense.service';
import { CategoryOption } from './expense-edit-dialog/expense-edit-dialog.component';
import { CATEGORIES, CATEGORY_BY_KEY, CategoryDefinition } from '../../core/categories';
import { sumAmounts, yearRange } from '../../core/expense-stats';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
  expenses: ExpenseResponse[] = [];

  isLoading = true;
  errorMessage: string | null = null;

  readonly currentMonth = this.toMonthKey(new Date());
  private readonly defaultPeriod = this.addMonths(this.currentMonth, -1);

  // Periodo selezionato: 'AAAA-MM' per un mese, 'AAAA' per l'anno intero.
  private period = this.defaultPeriod;
  private category = 'ALL';
  private search = '';

  years: number[] = [];
  periodTransactions: ExpenseResponse[] = [];
  filteredTransactions: ExpenseResponse[] = [];
  totalExpenses = 0;
  filteredTotal = 0;
  readonly categories = CATEGORIES;

  editingExpense: ExpenseResponse | null = null;
  editError: string | null = null;
  isSaving = false;
  deletingExpense: ExpenseResponse | null = null;
  confirmingMonthDelete = false;
  isDeleting = false;

  readonly categoryOptions: CategoryOption[] = CATEGORIES.map(
    (category) => ({ key: category.key, label: `${category.emoji} ${category.name}` }),
  );

  constructor(
    private expenseService: ExpenseService,
    private toastService: ToastService,
  ) {
    this.refresh();
  }

  ngOnInit(): void {
    this.loadExpenses();
  }

  private loadExpenses(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.expenseService.getAllExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.refresh();
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

  get selectedPeriod(): string {
    return this.period;
  }

  set selectedPeriod(period: string) {
    this.period = period;
    this.refresh();
  }

  get selectedCategory(): string {
    return this.category;
  }

  set selectedCategory(category: string) {
    this.category = category;
    this.applyFilters();
  }

  get searchTerm(): string {
    return this.search;
  }

  set searchTerm(term: string) {
    this.search = term;
    this.applyFilters();
  }

  get isYearView(): boolean {
    return this.period.length === 4;
  }

  get selectedYear(): number {
    return Number(this.period.substring(0, 4));
  }

  get selectedMonthNumber(): number | null {
    return this.isYearView ? null : Number(this.period.substring(5, 7));
  }

  get periodLabel(): string {
    return this.isYearView ? this.period : this.formatMonthLabel(this.period);
  }

  get periodStatus(): string {
    const current = this.isYearView
      ? this.currentMonth.substring(0, 4)
      : this.currentMonth;
    const noun = this.isYearView ? 'Anno' : 'Mese';

    if (this.period < current) {
      return `${noun} concluso`;
    }

    return this.period === current ? `${noun} in corso` : `${noun} futuro`;
  }

  get canGoPrevious(): boolean {
    return Number(this.shiftPeriod(-1).substring(0, 4)) >= this.years[0];
  }

  get canGoNext(): boolean {
    return (
      Number(this.shiftPeriod(1).substring(0, 4)) <=
      this.years[this.years.length - 1]
    );
  }

  goToPrevious(): void {
    if (this.canGoPrevious) {
      this.selectedPeriod = this.shiftPeriod(-1);
    }
  }

  goToNext(): void {
    if (this.canGoNext) {
      this.selectedPeriod = this.shiftPeriod(1);
    }
  }

  selectYear(year: number): void {
    this.selectedPeriod = this.isYearView
      ? String(year)
      : `${year}${this.period.substring(4)}`;
  }

  selectMonth(month: number | null): void {
    this.selectedPeriod =
      month === null
        ? String(this.selectedYear)
        : `${this.selectedYear}-${String(month).padStart(2, '0')}`;
  }

  categoryFor(key: string): CategoryDefinition | undefined {
    return CATEGORY_BY_KEY.get(key);
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

  openEdit(expense: ExpenseResponse): void {
    this.editingExpense = expense;
    this.editError = null;
  }

  closeEdit(): void {
    if (!this.isSaving) {
      this.editingExpense = null;
      this.editError = null;
    }
  }

  saveExpense(request: ExpenseUpdateRequest): void {
    const original = this.editingExpense;

    if (!original) {
      return;
    }

    this.isSaving = true;
    this.editError = null;

    this.expenseService.updateExpense(original.id, request).subscribe({
      next: (updated) => {
        this.expenses = this.expenses.map((expense) =>
          expense.id === updated.id ? updated : expense,
        );
        this.refresh();
        this.isSaving = false;
        this.editingExpense = null;

        const movedTo = updated.date.substring(0, 7);
        this.toastService.success(
          movedTo === original.date.substring(0, 7)
            ? 'Spesa aggiornata.'
            : `Spesa aggiornata e spostata a ${this.formatMonthLabel(movedTo)}.`,
        );
      },
      error: (error) => {
        this.isSaving = false;
        this.editError =
          error.error?.message || 'Non è stato possibile salvare la spesa.';
        this.toastService.error(`Modifica non riuscita. ${this.editError}`);
      },
    });
  }

  askDelete(expense: ExpenseResponse): void {
    this.deletingExpense = expense;
  }

  cancelDelete(): void {
    if (!this.isDeleting) {
      this.deletingExpense = null;
    }
  }

  get deleteExpenseMessage(): string {
    const expense = this.deletingExpense;

    if (!expense) {
      return '';
    }

    return (
      `«${expense.description || 'Spesa senza descrizione'}» del ` +
      `${this.formatDate(expense.date)}, ${this.formatEUR(expense.amount)}. ` +
      "L'operazione non si può annullare."
    );
  }

  confirmDelete(): void {
    const expense = this.deletingExpense;

    if (!expense) {
      return;
    }

    this.isDeleting = true;

    this.expenseService.deleteExpense(expense.id).subscribe({
      next: () => {
        this.expenses = this.expenses.filter((item) => item.id !== expense.id);
        this.refresh();
        this.isDeleting = false;
        this.deletingExpense = null;
        this.toastService.success('Spesa eliminata.');
      },
      error: (error) => {
        this.isDeleting = false;
        this.deletingExpense = null;
        this.toastService.error(
          `Eliminazione non riuscita. ${error.error?.message || 'Riprova più tardi.'}`,
        );
      },
    });
  }

  askDeleteMonth(): void {
    if (!this.isYearView && this.periodTransactions.length > 0) {
      this.confirmingMonthDelete = true;
    }
  }

  cancelDeleteMonth(): void {
    if (!this.isDeleting) {
      this.confirmingMonthDelete = false;
    }
  }

  get deleteMonthMessage(): string {
    const count = this.periodTransactions.length;
    const what =
      count === 1 ? 'Verrà eliminata 1 spesa' : `Verranno eliminate ${count} spese`;

    return (
      `${what} di ${this.periodLabel}, per un totale di ` +
      `${this.formatEUR(this.totalExpenses)}. L'operazione non si può annullare.`
    );
  }

  confirmDeleteMonth(): void {
    if (this.isYearView) {
      return;
    }

    const month = this.period;
    const label = this.periodLabel;

    this.isDeleting = true;

    this.expenseService.deleteMonth(month).subscribe({
      next: (result) => {
        this.expenses = this.expenses.filter(
          (expense) => !expense.date.startsWith(`${month}-`),
        );
        this.refresh();
        this.isDeleting = false;
        this.confirmingMonthDelete = false;
        this.toastService.success(
          result.deletedCount === 1
            ? `Eliminata 1 spesa di ${label}.`
            : `Eliminate ${result.deletedCount} spese di ${label}.`,
        );
      },
      error: (error) => {
        this.isDeleting = false;
        this.confirmingMonthDelete = false;
        this.toastService.error(
          `Eliminazione non riuscita. ${error.error?.message || 'Riprova più tardi.'}`,
        );
      },
    });
  }

  private refresh(): void {
    const prefix = `${this.period}-`;
    this.periodTransactions = this.expenses.filter((expense) =>
      expense.date.startsWith(prefix),
    );
    this.totalExpenses = sumAmounts(this.periodTransactions);
    this.years = yearRange(this.expenses, [
      this.selectedYear,
      Number(this.defaultPeriod.substring(0, 4)),
      Number(this.currentMonth.substring(0, 4)),
    ]);
    this.applyFilters();
  }

  private applyFilters(): void {
    const search = this.search.trim().toLocaleLowerCase('it-IT');

    this.filteredTransactions = this.periodTransactions
      .filter((expense) => {
        const matchesCategory =
          this.category === 'ALL' || expense.category === this.category;

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
    this.filteredTotal = sumAmounts(this.filteredTransactions);
  }

  private shiftPeriod(delta: number): string {
    return this.isYearView
      ? String(this.selectedYear + delta)
      : this.addMonths(this.period, delta);
  }

  private toMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }

  private addMonths(monthKey: string, delta: number): string {
    const [year, month] = monthKey.split('-').map(Number);

    return this.toMonthKey(new Date(year, month - 1 + delta, 1));
  }

  private formatMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split('-').map(Number);

    return new Intl.DateTimeFormat('it-IT', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month - 1, 1));
  }
}
