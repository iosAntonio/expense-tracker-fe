import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';
import { ExpenseResponse } from '../../services/expense.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ExpenseEditDialogComponent } from './expense-edit-dialog/expense-edit-dialog.component';
import { ExpensesComponent } from './expenses.component';
import { PeriodSelectorComponent } from './period-selector/period-selector.component';

function monthKey(offset: number): string {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function expense(
  id: number,
  date: string,
  description: string | null,
  amount: number,
  category: string
): ExpenseResponse {
  return { id, date, description, amount, category, paymentMethod: null };
}

describe('ExpensesComponent', () => {
  const url = `${environment.apiUrl}/expenses`;
  const previousMonth = monthKey(-1);
  const currentMonth = monthKey(0);
  const futureMonth = monthKey(2);

  const expenses: ExpenseResponse[] = [
    {
      ...expense(1, `${previousMonth}-03`, 'Spesa settimanale', 40.5, 'ALIMENTARI'),
      paymentMethod: 'Carta',
    },
    expense(2, `${previousMonth}-10`, 'Cena', 30, 'BAR_RISTORAZIONE'),
    { ...expense(3, `${currentMonth}-01`, 'Benzina', 60, 'AUTO'), paymentMethod: 'Carta' },
    expense(4, '2025-01-15', 'Spesa vecchia', 12, 'ALTRO'),
    { ...expense(5, `${futureMonth}-05`, 'Volo prenotato', 150, 'VIAGGI'), paymentMethod: 'Carta' },
  ];

  let fixture: ComponentFixture<ExpensesComponent>;
  let component: ExpensesComponent;
  let httpMock: HttpTestingController;
  let toast: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [
        ExpensesComponent,
        ExpenseEditDialogComponent,
        ConfirmDialogComponent,
        PeriodSelectorComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);
    spyOn(toast, 'success');
    spyOn(toast, 'error');
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  function respondWith(data: ExpenseResponse[]): void {
    httpMock.expectOne(url).flush(data);
    fixture.detectChanges();
  }

  function ids(list: ExpenseResponse[]): number[] {
    return list.map(item => item.id);
  }

  function rowButton(row: number, title: string): HTMLButtonElement {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    return rows[row].querySelector(`button[title="${title}"]`);
  }

  function confirmDialog(): HTMLElement {
    return fixture.nativeElement.querySelector('app-confirm-dialog');
  }

  function deleteMonthButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.delete-month-button');
  }

  describe('with dates relative to today', () => {
    it('shows the previous month by default with its total', () => {
      respondWith(expenses);

      expect(component.selectedPeriod).toBe(previousMonth);
      expect(ids(component.periodTransactions)).toEqual([1, 2]);
      expect(component.totalExpenses).toBe(70.5);
      expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    });

    it('lets the user reach every year with expenses, past and future', () => {
      respondWith(expenses);
      const lastYear = Number(futureMonth.substring(0, 4));

      expect(component.years[0]).toBe(2025);
      expect(component.years[component.years.length - 1]).toBe(lastYear);

      component.selectedPeriod = '2025-01';
      expect(ids(component.periodTransactions)).toEqual([4]);
      expect(component.canGoPrevious).toBeFalse();

      component.selectedPeriod = futureMonth;
      expect(ids(component.periodTransactions)).toEqual([5]);
      expect(component.periodStatus).toBe('Mese futuro');

      component.selectedPeriod = `${lastYear}-12`;
      expect(component.canGoNext).toBeFalse();
    });

    it('offers the years of the previous and current month when there are no expenses', () => {
      respondWith([]);

      const expectedYears = Array.from(
        new Set([Number(previousMonth.substring(0, 4)), Number(currentMonth.substring(0, 4))])
      );
      expect(component.years).toEqual(expectedYears);
      expect(fixture.nativeElement.textContent).toContain('Nessuna spesa registrata');
    });

    it('filters the selected month by category and search text', () => {
      respondWith(expenses);

      component.selectedCategory = 'ALIMENTARI';
      expect(ids(component.filteredTransactions)).toEqual([1]);

      component.selectedCategory = 'ALL';
      component.searchTerm = 'cena';
      expect(ids(component.filteredTransactions)).toEqual([2]);
      expect(component.filteredTotal).toBe(30);
    });

    it('does not show made-up income, balance or investment figures', () => {
      respondWith(expenses);

      const values = Array.from(
        fixture.nativeElement.querySelectorAll('.metric-value') as NodeListOf<HTMLElement>
      ).map(value => value.textContent?.trim());

      expect(values.filter(value => value === '—').length).toBe(3);
      expect(fixture.nativeElement.textContent).not.toContain('3.056,56');
    });

    it('shows an error when the expenses cannot be loaded', () => {
      spyOn(console, 'error');
      httpMock.expectOne(url).flush('errore', { status: 500, statusText: 'Server Error' });
      fixture.detectChanges();

      expect(component.errorMessage).toContain('Non è stato possibile caricare le spese');
      expect(fixture.nativeElement.querySelector('.error-state')).not.toBeNull();
    });

    it('edits an expense from its row', () => {
      respondWith(expenses);

      rowButton(0, 'Modifica').click();
      fixture.detectChanges();
      expect(component.editingExpense?.id).toBe(2);
      expect(fixture.nativeElement.querySelector('app-expense-edit-dialog dialog')).not.toBeNull();

      component.saveExpense({
        date: `${previousMonth}-10`,
        description: 'Cena di lavoro',
        amount: 35,
        category: 'BAR_RISTORAZIONE',
        paymentMethod: 'Carta',
      });
      const request = httpMock.expectOne(`${url}/2`);
      expect(request.request.method).toBe('PUT');
      expect(request.request.body.description).toBe('Cena di lavoro');
      request.flush({
        ...expenses[1],
        description: 'Cena di lavoro',
        amount: 35,
        paymentMethod: 'Carta',
      });
      fixture.detectChanges();

      expect(component.editingExpense).toBeNull();
      expect(fixture.nativeElement.querySelector('app-expense-edit-dialog')).toBeNull();
      expect(component.totalExpenses).toBe(75.5);
      expect(toast.success).toHaveBeenCalledWith('Spesa aggiornata.');
    });

    it('keeps the edit open and explains when the change is refused', () => {
      respondWith(expenses);

      component.openEdit(expenses[1]);
      fixture.detectChanges();
      component.saveExpense({
        date: `${previousMonth}-10`,
        description: 'Cena',
        amount: 30,
        category: 'BAR_RISTORAZIONE',
        paymentMethod: null,
      });
      httpMock
        .expectOne(`${url}/2`)
        .flush({ message: 'Spesa non trovata.' }, { status: 404, statusText: 'Not Found' });
      fixture.detectChanges();

      expect(component.editingExpense?.id).toBe(2);
      expect(fixture.nativeElement.querySelector('app-expense-edit-dialog').textContent).toContain(
        'Spesa non trovata.'
      );
      expect(toast.error).toHaveBeenCalledWith('Modifica non riuscita. Spesa non trovata.');
    });

    it('deletes a single expense only after confirmation', () => {
      respondWith(expenses);

      rowButton(0, 'Elimina').click();
      fixture.detectChanges();
      expect(confirmDialog().textContent).toContain('«Cena»');
      httpMock.expectNone(`${url}/2`);

      (confirmDialog().querySelector('.button-danger') as HTMLButtonElement).click();
      const request = httpMock.expectOne(`${url}/2`);
      expect(request.request.method).toBe('DELETE');
      request.flush(null, { status: 204, statusText: 'No Content' });
      fixture.detectChanges();

      expect(ids(component.periodTransactions)).toEqual([1]);
      expect(confirmDialog()).toBeNull();
      expect(toast.success).toHaveBeenCalledWith('Spesa eliminata.');
    });

    it('deletes the whole selected month after confirmation', () => {
      respondWith(expenses);
      const label = component.periodLabel;

      deleteMonthButton().click();
      fixture.detectChanges();
      expect(confirmDialog().textContent).toContain(`Verranno eliminate 2 spese di ${label}`);

      (confirmDialog().querySelector('.button-danger') as HTMLButtonElement).click();
      const request = httpMock.expectOne(req => req.method === 'DELETE' && req.url === url);
      expect(request.request.params.get('month')).toBe(previousMonth);
      request.flush({ month: previousMonth, deletedCount: 2 });
      fixture.detectChanges();

      expect(component.periodTransactions).toEqual([]);
      expect(ids(component.expenses)).toEqual([3, 4, 5]);
      expect(confirmDialog()).toBeNull();
      expect(toast.success).toHaveBeenCalledWith(`Eliminate 2 spese di ${label}.`);
    });

    it('does not offer to delete an empty month', () => {
      respondWith([]);

      expect(deleteMonthButton().disabled).toBeTrue();
    });
  });

  describe('across 2025 and 2026', () => {
    const multiYear: ExpenseResponse[] = [
      expense(1, '2025-01-01', 'Brindisi di Capodanno', 25, 'BAR_RISTORAZIONE'),
      expense(2, '2025-01-20', 'Spesa settimanale', 80, 'ALIMENTARI'),
      expense(3, '2025-08-10', 'Volo per le vacanze', 320, 'VIAGGI'),
      expense(4, '2025-10-05', 'Bolletta luce', 70, 'CASA'),
      expense(5, '2025-12-31', 'Cenone', 90, 'BAR_RISTORAZIONE'),
      expense(6, '2026-01-01', 'Brunch', 30, 'BAR_RISTORAZIONE'),
      expense(7, '2026-02-28', 'Farmacia', 15.5, 'SALUTE'),
      expense(8, '2026-10-05', 'Bolletta luce', 85, 'CASA'),
      expense(9, '2026-12-24', 'Regali di Natale', 200, 'SHOPPING'),
    ];

    beforeEach(() => respondWith(multiYear));

    it('lists every year from the oldest expense to the current one, with no gaps', () => {
      const years = component.years;

      expect(years[0]).toBe(2025);
      expect(years).toContain(2026);
      expect(years.every((year, index) => index === 0 || year === years[index - 1] + 1)).toBeTrue();
    });

    it('shows all the expenses of a whole year', () => {
      component.selectYear(2025);
      component.selectMonth(null);
      fixture.detectChanges();

      expect(component.selectedPeriod).toBe('2025');
      expect(component.isYearView).toBeTrue();
      expect(ids(component.filteredTransactions)).toEqual([5, 4, 3, 2, 1]);
      expect(component.totalExpenses).toBe(585);
      expect(component.periodStatus).toBe('Anno concluso');
      expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
      expect(fixture.nativeElement.querySelector('app-year-overview')).toBeNull();
    });

    it('keeps the same month of different years apart', () => {
      component.selectedPeriod = '2025-10';
      expect(ids(component.periodTransactions)).toEqual([4]);
      expect(component.totalExpenses).toBe(70);

      component.selectYear(2026);
      expect(component.selectedPeriod).toBe('2026-10');
      expect(ids(component.periodTransactions)).toEqual([8]);
      expect(component.totalExpenses).toBe(85);
    });

    it('crosses the year boundary when moving month by month', () => {
      component.selectedPeriod = '2025-12';

      component.goToNext();
      expect(component.selectedPeriod).toBe('2026-01');
      expect(ids(component.periodTransactions)).toEqual([6]);

      component.goToPrevious();
      expect(component.selectedPeriod).toBe('2025-12');
      expect(ids(component.periodTransactions)).toEqual([5]);
    });

    it('moves by whole years in the year view and stops at the first year', () => {
      component.selectedPeriod = '2026';

      component.goToPrevious();
      expect(component.selectedPeriod).toBe('2025');
      expect(component.canGoPrevious).toBeFalse();

      component.goToPrevious();
      expect(component.selectedPeriod).toBe('2025');
    });

    it('does not offer to delete a whole year', () => {
      component.selectedPeriod = '2025';
      fixture.detectChanges();

      expect(deleteMonthButton().disabled).toBeTrue();
      component.askDeleteMonth();
      expect(component.confirmingMonthDelete).toBeFalse();
    });

    it('deletes December 2025 without touching December 2026', () => {
      component.selectedPeriod = '2025-12';
      fixture.detectChanges();

      deleteMonthButton().click();
      fixture.detectChanges();
      (confirmDialog().querySelector('.button-danger') as HTMLButtonElement).click();
      const request = httpMock.expectOne(req => req.method === 'DELETE' && req.url === url);
      expect(request.request.params.get('month')).toBe('2025-12');
      request.flush({ month: '2025-12', deletedCount: 1 });

      expect(ids(component.expenses)).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
      expect(component.periodTransactions).toEqual([]);
      component.selectYear(2026);
      expect(ids(component.periodTransactions)).toEqual([9]);
    });

    it('moves an edited expense into the next year', () => {
      component.selectedPeriod = '2025-12';
      component.openEdit(multiYear[4]);
      component.saveExpense({
        date: '2026-01-02',
        description: 'Cenone',
        amount: 90,
        category: 'BAR_RISTORAZIONE',
        paymentMethod: null,
      });
      httpMock.expectOne(`${url}/5`).flush({ ...multiYear[4], date: '2026-01-02' });

      expect(component.periodTransactions).toEqual([]);
      expect(toast.success).toHaveBeenCalledWith('Spesa aggiornata e spostata a gennaio 2026.');

      component.goToNext();
      expect(ids(component.periodTransactions)).toEqual([5, 6]);
    });
  });
});
