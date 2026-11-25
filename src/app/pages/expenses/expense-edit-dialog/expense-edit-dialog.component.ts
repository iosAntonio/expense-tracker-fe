import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { ExpenseResponse, ExpenseUpdateRequest } from '../../../services/expense.service';
import { openModal } from '../../../shared/dialog';

export interface CategoryOption {
  key: string;
  label: string;
}

interface ExpenseForm {
  date: string;
  amount: number | null;
  description: string;
  category: string;
  paymentMethod: string;
}

const MAX_TEXT_LENGTH = 255;

@Component({
  selector: 'app-expense-edit-dialog',
  templateUrl: './expense-edit-dialog.component.html',
  styleUrls: ['./expense-edit-dialog.component.scss'],
})
export class ExpenseEditDialogComponent implements OnInit, AfterViewInit {
  @Input() expense!: ExpenseResponse;
  @Input() categories: CategoryOption[] = [];
  @Input() saving = false;
  @Input() serverError: string | null = null;

  @Output() saved = new EventEmitter<ExpenseUpdateRequest>();
  @Output() dismissed = new EventEmitter<void>();

  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;

  form: ExpenseForm = { date: '', amount: null, description: '', category: '', paymentMethod: '' };
  errors: string[] = [];

  ngOnInit(): void {
    this.form = {
      date: this.expense.date,
      amount: this.expense.amount,
      description: this.expense.description ?? '',
      category: this.expense.category,
      paymentMethod: this.expense.paymentMethod ?? '',
    };
  }

  ngAfterViewInit(): void {
    openModal(this.dialog?.nativeElement);
  }

  onCancel(event: Event): void {
    event.preventDefault();
    this.dismiss();
  }

  dismiss(): void {
    if (!this.saving) {
      this.dismissed.emit();
    }
  }

  submit(): void {
    this.errors = this.validate();

    if (this.errors.length > 0 || this.saving) {
      return;
    }

    this.saved.emit({
      date: this.form.date,
      description: this.form.description.trim() || null,
      amount: this.form.amount as number,
      category: this.form.category,
      paymentMethod: this.form.paymentMethod.trim() || null,
    });
  }

  private validate(): string[] {
    const errors: string[] = [];
    const amount = this.form.amount;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.form.date)) {
      errors.push('Inserisci una data valida.');
    }

    if (
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      Number(amount.toFixed(2)) !== amount
    ) {
      errors.push("L'importo deve essere positivo e avere al massimo 2 decimali.");
    }

    if (!this.categories.some(category => category.key === this.form.category)) {
      errors.push('Scegli una categoria.');
    }

    if (
      this.form.description.length > MAX_TEXT_LENGTH ||
      this.form.paymentMethod.length > MAX_TEXT_LENGTH
    ) {
      errors.push('Descrizione e metodo di pagamento possono avere al massimo 255 caratteri.');
    }

    return errors;
  }
}
