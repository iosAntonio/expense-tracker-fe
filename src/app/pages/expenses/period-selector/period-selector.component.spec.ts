import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PeriodSelectorComponent } from './period-selector.component';

describe('PeriodSelectorComponent', () => {
  let fixture: ComponentFixture<PeriodSelectorComponent>;
  let component: PeriodSelectorComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PeriodSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeriodSelectorComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.years = [2025, 2026];
    component.year = 2025;
    component.month = 12;
    component.canGoPrevious = true;
    component.canGoNext = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  function selects(): HTMLSelectElement[] {
    return Array.from(element.querySelectorAll('select'));
  }

  function buttons(): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll('button'));
  }

  it('offers the years and the twelve months plus the whole year', () => {
    const [year, month] = selects();

    expect(Array.from(year.options).map(option => option.textContent?.trim())).toEqual([
      '2025',
      '2026',
    ]);
    expect(month.options.length).toBe(13);
    expect(month.options[0].textContent?.trim()).toBe("Tutto l'anno");
    expect(month.options[1].textContent?.trim()).toBe('Gennaio');
    expect(month.options[12].textContent?.trim()).toBe('Dicembre');
    expect(year.selectedOptions[0].textContent?.trim()).toBe('2025');
    expect(month.selectedOptions[0].textContent?.trim()).toBe('Dicembre');
  });

  it('reports the chosen year and month as numbers, and the whole year as null', () => {
    const years: number[] = [];
    const months: (number | null)[] = [];
    component.yearChange.subscribe(year => years.push(year));
    component.monthChange.subscribe(month => months.push(month));
    const [year, month] = selects();

    year.selectedIndex = 1;
    year.dispatchEvent(new Event('change'));
    month.selectedIndex = 3;
    month.dispatchEvent(new Event('change'));
    month.selectedIndex = 0;
    month.dispatchEvent(new Event('change'));

    expect(years).toEqual([2026]);
    expect(months).toEqual([3, null]);
  });

  it('names the arrows after the current view and disables them at the limits', () => {
    expect(buttons()[0].getAttribute('aria-label')).toBe('Mese precedente');

    component.month = null;
    component.canGoPrevious = false;
    fixture.detectChanges();

    expect(buttons()[0].getAttribute('aria-label')).toBe('Anno precedente');
    expect(buttons()[1].getAttribute('aria-label')).toBe('Anno successivo');
    expect(buttons()[0].disabled).toBeTrue();

    const steps: string[] = [];
    component.previous.subscribe(() => steps.push('previous'));
    component.next.subscribe(() => steps.push('next'));
    buttons()[1].click();
    expect(steps).toEqual(['next']);
  });
});
