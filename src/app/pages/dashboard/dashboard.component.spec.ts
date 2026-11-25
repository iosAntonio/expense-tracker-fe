import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { ExpenseResponse } from '../../services/expense.service';
import { CategoryFilterComponent } from '../../shared/category-filter/category-filter.component';
import { DashboardComponent } from './dashboard.component';
import { YearOverviewComponent } from './year-overview/year-overview.component';

function expense(id: number, date: string, amount: number, category: string): ExpenseResponse {
  return { id, date, description: null, amount, category, paymentMethod: null };
}

function eur(value: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
}

describe('DashboardComponent', () => {
  const url = `${environment.apiUrl}/expenses`;
  const multiYear: ExpenseResponse[] = [
    expense(1, '2025-01-01', 25, 'BAR_RISTORAZIONE'),
    expense(2, '2025-01-20', 80, 'ALIMENTARI'),
    expense(3, '2025-08-10', 320, 'VIAGGI'),
    expense(4, '2025-10-05', 70, 'CASA'),
    expense(5, '2025-12-31', 90, 'BAR_RISTORAZIONE'),
    expense(6, '2026-01-01', 30, 'BAR_RISTORAZIONE'),
    expense(7, '2026-02-28', 15.5, 'SALUTE'),
    expense(8, '2026-10-05', 85, 'CASA'),
    expense(9, '2026-12-24', 200, 'SHOPPING'),
  ];

  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let httpMock: HttpTestingController;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [DashboardComponent, YearOverviewComponent, CategoryFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  async function respondWith(data: ExpenseResponse[]): Promise<void> {
    httpMock.expectOne(url).flush(data);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function yearSelect(): HTMLSelectElement {
    return element.querySelector('.year-select') as HTMLSelectElement;
  }

  function chooseYear(year: number): void {
    const select = yearSelect();
    select.selectedIndex = Array.from(select.options).findIndex(
      option => option.textContent?.trim() === String(year)
    );
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function bars(): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll('app-year-overview .month-bar'));
  }

  function breakdown(): string[] {
    return Array.from(element.querySelectorAll('.category-row .category-name')).map(
      name => name.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    );
  }

  function donut(): HTMLElement {
    return element.querySelector('.donut') as HTMLElement;
  }

  it('opens on the most recent year with expenses and offers every year', async () => {
    await respondWith(multiYear);

    expect(component.selectedYear).toBe(2026);
    expect(component.years[0]).toBe(2025);
    expect(Array.from(yearSelect().options).map(option => option.textContent?.trim())).toContain(
      '2025'
    );
    expect(bars().length).toBe(12);
  });

  it('shows the twelve months and the categories of the year chosen in the selector', async () => {
    await respondWith(multiYear);

    chooseYear(2025);

    expect(component.selectedYear).toBe(2025);
    expect(component.yearMonths.map(month => month.total)).toEqual([
      105, 0, 0, 0, 0, 0, 0, 320, 0, 70, 0, 90,
    ]);
    expect(breakdown()).toEqual([
      '✈️ Viaggi',
      '🍽️ Bar e Ristoranti',
      '🛒 Spesa & Alimentari',
      '🏠 Casa & Utenze',
    ]);
    expect(element.querySelector('.donut-center')?.textContent).toContain(eur(585));
    expect(element.querySelector('.period-tag')?.textContent?.trim()).toBe('2025');
    expect(donut().style.background).toContain('conic-gradient');
    expect(donut().getAttribute('aria-label')).toContain('Viaggi 54,7%');
  });

  it('focuses the donut on a month clicked in the overview, and back on the year with a second click', async () => {
    await respondWith(multiYear);
    chooseYear(2025);

    bars()[0].click();
    fixture.detectChanges();

    expect(component.selectedMonth).toBe(1);
    expect(element.querySelector('.period-tag')?.textContent?.trim()).toBe('gennaio 2025');
    expect(breakdown()).toEqual(['🛒 Spesa & Alimentari', '🍽️ Bar e Ristoranti']);
    expect(element.querySelector('.donut-center')?.textContent).toContain(eur(105));
    expect(element.querySelector('.whole-year-button')?.textContent).toContain(
      'Mostra tutto il 2025'
    );

    bars()[0].click();
    fixture.detectChanges();

    expect(component.selectedMonth).toBeNull();
    expect(element.querySelector('.donut-center')?.textContent).toContain(eur(585));
  });

  it('goes back to the whole year with the button and when the year changes', async () => {
    await respondWith(multiYear);
    chooseYear(2025);
    bars()[7].click();
    fixture.detectChanges();

    (element.querySelector('.whole-year-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(component.selectedMonth).toBeNull();

    bars()[7].click();
    fixture.detectChanges();
    chooseYear(2026);
    expect(component.selectedMonth).toBeNull();
    expect(element.querySelector('.donut-center')?.textContent).toContain(eur(330.5));
  });

  it('shows an empty ring and says so when there are no expenses', async () => {
    await respondWith([]);

    expect(component.selectedYear).toBe(new Date().getFullYear());
    expect(breakdown()).toEqual([]);
    expect(element.querySelector('.empty-note')?.textContent).toContain(
      `Nessuna spesa registrata nel ${new Date().getFullYear()}.`
    );
    expect(donut().style.background).toContain('conic-gradient');
  });

  it('explains when the expenses cannot be loaded', async () => {
    httpMock.expectOne(url).flush('errore', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(element.querySelector('.state-message.error')?.textContent).toContain(
      'Non è stato possibile caricare le spese'
    );
    expect(element.querySelector('app-year-overview')).toBeNull();
  });

  it('filters trend, donut and breakdown by the chosen categories, also across years', async () => {
    await respondWith(multiYear);
    chooseYear(2025);

    component.selectCategories(['BAR_RISTORAZIONE', 'CASA']);
    fixture.detectChanges();

    expect(component.yearMonths.map(month => month.total)).toEqual([
      25, 0, 0, 0, 0, 0, 0, 0, 0, 70, 0, 90,
    ]);
    expect(breakdown()).toEqual(['🍽️ Bar e Ristoranti', '🏠 Casa & Utenze']);
    expect(element.querySelector('.donut-center')?.textContent).toContain(eur(185));

    chooseYear(2026);

    expect(component.selectedCategories).toEqual(['BAR_RISTORAZIONE', 'CASA']);
    expect(element.querySelector('.donut-center')?.textContent).toContain(eur(115));
  });

  it('says when the chosen categories have no expenses in the period', async () => {
    await respondWith(multiYear);
    chooseYear(2025);

    component.selectCategories(['SPORT']);
    fixture.detectChanges();

    expect(element.querySelector('.empty-note')?.textContent).toContain(
      'Nessuna spesa delle categorie selezionate nel 2025.'
    );
  });
});
