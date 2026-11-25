import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ExpenseResponse } from '../../../services/expense.service';
import { CategoryOption, ExpenseEditDialogComponent } from './expense-edit-dialog.component';

describe('ExpenseEditDialogComponent', () => {
  const expense: ExpenseResponse = {
    id: 4,
    date: '2026-10-02',
    description: 'Spesa',
    amount: 42.5,
    category: 'ALIMENTARI',
    paymentMethod: 'Carta',
  };
  const categories: CategoryOption[] = [
    { key: 'ALIMENTARI', label: 'Spesa & Alimentari' },
    { key: 'CASA', label: 'Casa & Utenze' },
  ];

  let fixture: ComponentFixture<ExpenseEditDialogComponent>;
  let component: ExpenseEditDialogComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ExpenseEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseEditDialogComponent);
    component = fixture.componentInstance;
    component.expense = expense;
    component.categories = categories;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  function field(name: string): HTMLInputElement {
    return element.querySelector(`[name="${name}"]`) as HTMLInputElement;
  }

  function setValue(name: string, value: string): void {
    const input = field(name);
    input.value = value;
    input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
  }

  function submit(): void {
    (element.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();
  }

  it('opens as a modal prefilled with the expense', () => {
    expect((element.querySelector('dialog') as HTMLElement & { open: boolean }).open).toBeTrue();
    expect(field('date').value).toBe('2026-10-02');
    expect(field('amount').value).toBe('42.5');
    expect(field('description').value).toBe('Spesa');
    expect(field('category').value).toBe('ALIMENTARI');
    expect(field('paymentMethod').value).toBe('Carta');
  });

  it('emits the changes, turning empty texts into null', () => {
    const saved = jasmine.createSpy('saved');
    component.saved.subscribe(saved);

    setValue('date', '2026-11-03');
    setValue('amount', '40.1');
    setValue('description', '  ');
    setValue('category', 'CASA');
    setValue('paymentMethod', '');
    submit();

    expect(saved).toHaveBeenCalledWith({
      date: '2026-11-03',
      description: null,
      amount: 40.1,
      category: 'CASA',
      paymentMethod: null,
    });
  });

  it('lists what is wrong instead of saving', () => {
    const saved = jasmine.createSpy('saved');
    component.saved.subscribe(saved);

    setValue('date', '');
    setValue('amount', '1.234');
    submit();

    const errors = element.querySelector('.form-errors')?.textContent;
    expect(saved).not.toHaveBeenCalled();
    expect(errors).toContain('Inserisci una data valida.');
    expect(errors).toContain("L'importo deve essere positivo e avere al massimo 2 decimali.");
  });

  it('shows the server error and cannot be closed while saving', () => {
    const dismissed = jasmine.createSpy('dismissed');
    component.dismissed.subscribe(dismissed);

    component.serverError = 'Spesa non trovata.';
    component.saving = true;
    fixture.detectChanges();

    expect(element.querySelector('.form-errors')?.textContent).toContain('Spesa non trovata.');
    expect(
      (element.querySelector('button[type="submit"]') as HTMLButtonElement).disabled
    ).toBeTrue();
    (element.querySelector('dialog') as HTMLElement).dispatchEvent(
      new Event('cancel', { cancelable: true })
    );
    expect(dismissed).not.toHaveBeenCalled();

    component.saving = false;
    fixture.detectChanges();
    (
      element.querySelector('.dialog-actions .button:not(.button-primary)') as HTMLButtonElement
    ).click();

    expect(dismissed).toHaveBeenCalledTimes(1);
  });
});
