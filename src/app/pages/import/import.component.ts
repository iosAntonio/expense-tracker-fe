
import { Component, OnInit } from '@angular/core';
import { CATEGORY_BY_KEY, CATEGORY_KEYS } from '../../core/categories';
import { ToastService } from '../../core/services/toast.service';
import {
  ExpenseImportRequest,
  ExpenseImportResponse,
  ExpenseService,
  ImportBatch,
  ImportRevertResponse
} from '../../services/expense.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  selectedFile: string | null = null;
  expenses: ExpenseImportRequest[] = [];

  errors: string[] = [];
  isImporting = false;

  importedCount: number | null = null;
  skippedExternalIds: string[] = [];
  importError: string | null = null;

  previousImports: ImportBatch[] = [];
  isChecking = false;
  private checkToken = 0;

  lastBatch: ImportBatch | null = null;
  batches: ImportBatch[] = [];
  historyError: string | null = null;
  confirmingRevertId: number | null = null;
  revertingId: number | null = null;
  revertMessage: string | null = null;

  constructor(
    private expenseService: ExpenseService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.expenseService.getImports().subscribe({
      next: batches => {
        this.batches = batches;
        this.historyError = null;
      },
      error: () => {
        this.historyError = 'Non è stato possibile caricare gli import recenti.';
      }
    });
  }

  get previousImportMessage(): string | null {
    const latest = this.previousImports[0];

    if (!latest) {
      return null;
    }

    const count = latest.importedCount === 1
      ? '1 spesa'
      : `${latest.importedCount} spese`;

    return `Questo contenuto è già stato importato il ${this.formatDateTime(latest.importedAt)} ` +
      `come «${latest.fileName}» (${count}). ` +
      'Se lo importi di nuovo, le spese già presenti verranno saltate.';
  }

  get totalAmount(): number {
    return this.expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }

  get importedMessage(): string {
    if (!this.importedCount) {
      return 'Nessuna nuova spesa importata.';
    }

    return this.importedCount === 1
      ? '1 spesa importata correttamente.'
      : `${this.importedCount} spese importate correttamente.`;
  }

  get skippedMessage(): string | null {
    const count = this.skippedExternalIds.length;

    if (count === 0) {
      return null;
    }

    const shown = this.skippedExternalIds.slice(0, 5).join(', ');
    const others = count > 5 ? ` e altre ${count - 5}` : '';

    return count === 1
      ? `1 spesa era già presente ed è stata saltata (${shown}).`
      : `${count} spese erano già presenti e sono state saltate (${shown}${others}).`;
  }

  get canImport(): boolean {
    return this.expenses.length > 0 &&
      this.errors.length === 0 &&
      !this.isChecking &&
      !this.isImporting &&
      this.importedCount === null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0
      ? input.files[0]
      : null;

    if (file) {
      this.readFile(file);
    }

    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    const file = event.dataTransfer &&
      event.dataTransfer.files.length > 0
      ? event.dataTransfer.files[0]
      : null;

    if (file) {
      this.readFile(file);
    }
  }

  private readFile(file: File): void {
    this.resetState();

    if (!file.name.toLowerCase().endsWith('.json')) {
      this.errors = ['Seleziona un file con estensione .json'];
      return;
    }

    this.selectedFile = file.name;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(reader.result as string);
        this.validateData(parsed);
      } catch (error) {
        this.errors = ['Il file non contiene un JSON valido.'];
      }
    };

    reader.onerror = () => {
      this.errors = ['Non è stato possibile leggere il file.'];
    };

    reader.readAsText(file);
  }

  private validateData(data: unknown): void {
    if (!Array.isArray(data)) {
      this.errors = ['Il JSON deve contenere un array di spese.'];
      return;
    }

    if (data.length === 0) {
      this.errors = ['Il file non contiene nessuna spesa.'];
      return;
    }

    const validationErrors: string[] = [];
    const externalIds = new Set<string>();
    const validExpenses: ExpenseImportRequest[] = [];

    data.forEach((item: unknown, index: number) => {
      const row = index + 1;

      if (
        typeof item !== 'object' ||
        item === null ||
        Array.isArray(item)
      ) {
        validationErrors.push(
          `Riga ${row}: il record non è un oggetto valido.`
        );
        return;
      }

      const expense = item as Record<string, unknown>;

      const externalId = expense['externalId'];
      const date = expense['date'];
      const description = expense['description'];
      const amount = expense['amount'];
      const category = expense['category'];
      const paymentMethod = expense['paymentMethod'];

      let valid = true;

      if (
        typeof externalId !== 'string' ||
        externalId.trim().length === 0
      ) {
        validationErrors.push(
          `Riga ${row}: externalId è obbligatorio.`
        );
        valid = false;
      } else if (externalIds.has(externalId)) {
        validationErrors.push(
          `Riga ${row}: externalId duplicato (${externalId}).`
        );
        valid = false;
      } else {
        externalIds.add(externalId);
      }

      if (
        typeof date !== 'string' ||
        !this.isValidDate(date)
      ) {
        validationErrors.push(
          `Riga ${row}: data non valida. Usa YYYY-MM-DD.`
        );
        valid = false;
      }

      if (
        typeof amount !== 'number' ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        Number(amount.toFixed(2)) !== amount
      ) {
        validationErrors.push(
          `Riga ${row}: importo non valido. Deve essere positivo e avere massimo 2 decimali.`
        );
        valid = false;
      }

      if (
        typeof category !== 'string' ||
        !CATEGORY_KEYS.includes(category)
      ) {
        validationErrors.push(
          `Riga ${row}: categoria non riconosciuta.`
        );
        valid = false;
      }

      if (
        description !== undefined &&
        description !== null &&
        (typeof description !== 'string' || description.length > 255)
      ) {
        validationErrors.push(
          `Riga ${row}: descrizione non valida o superiore a 255 caratteri.`
        );
        valid = false;
      }

      if (
        paymentMethod !== undefined &&
        paymentMethod !== null &&
        (typeof paymentMethod !== 'string' || paymentMethod.length > 255)
      ) {
        validationErrors.push(
          `Riga ${row}: metodo di pagamento non valido o superiore a 255 caratteri.`
        );
        valid = false;
      }

      if (valid) {
        validExpenses.push({
          externalId: (externalId as string).trim(),
          date: date as string,
          description: (description as string | null | undefined) ?? null,
          amount: amount as number,
          category: category as string,
          paymentMethod: (paymentMethod as string | null | undefined) ?? null
        });
      }
    });

    this.errors = validationErrors;

    if (validationErrors.length === 0) {
      this.expenses = validExpenses;
      this.checkPreviousImports();
    }
  }

  private checkPreviousImports(): void {
    const token = ++this.checkToken;
    this.isChecking = true;

    this.expenseService.checkImport(this.expenses).subscribe({
      next: result => {
        if (token === this.checkToken) {
          this.previousImports = result.previousImports;
          this.isChecking = false;
        }
      },
      error: () => {
        if (token === this.checkToken) {
          this.isChecking = false;
        }
      }
    });
  }

  private isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00Z`);

    return !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value;
  }

  confirmImport(): void {
    if (!this.canImport) {
      return;
    }

    this.isImporting = true;
    this.importError = null;

    this.expenseService.importExpenses(this.selectedFile ?? '', this.expenses).subscribe({
      next: (response: ExpenseImportResponse) => {
        this.importedCount = response.imported.length;
        this.skippedExternalIds = response.skippedExternalIds;
        this.lastBatch = response.batch;
        this.isImporting = false;
        this.toastService.success(this.importToastMessage());
        this.loadHistory();
      },
      error: error => {
        this.importError =
          error.error?.message ||
          'Si è verificato un errore durante l’importazione.';

        this.isImporting = false;
        this.toastService.error(`Importazione non riuscita. ${this.importError}`);
      }
    });
  }

  resetState(): void {
    this.selectedFile = null;
    this.expenses = [];
    this.errors = [];
    this.importedCount = null;
    this.skippedExternalIds = [];
    this.importError = null;
    this.previousImports = [];
    this.isChecking = false;
    this.checkToken++;
    this.lastBatch = null;
    this.confirmingRevertId = null;
    this.revertMessage = null;
  }

  requestRevert(batch: ImportBatch): void {
    if (this.revertingId !== null || batch.revertedAt) {
      return;
    }

    if (this.confirmingRevertId !== batch.id) {
      this.confirmingRevertId = batch.id;
      return;
    }

    this.revertingId = batch.id;
    this.revertMessage = null;

    this.expenseService.revertImport(batch.id).subscribe({
      next: (response: ImportRevertResponse) => {
        const message = response.removedCount === 1
          ? 'Import annullato: 1 spesa rimossa.'
          : `Import annullato: ${response.removedCount} spese rimosse.`;
        this.revertMessage = message;

        if (this.lastBatch?.id === response.batch.id) {
          this.lastBatch = response.batch;
        }

        this.toastService.success(message);
        this.revertingId = null;
        this.confirmingRevertId = null;
        this.loadHistory();
      },
      error: error => {
        const message: string =
          error.error?.message || 'Non è stato possibile annullare l’import.';
        this.revertMessage = message;
        this.toastService.error(message);
        this.revertingId = null;
        this.confirmingRevertId = null;
        this.loadHistory();
      }
    });
  }

  private importToastMessage(): string {
    const skipped = this.skippedExternalIds.length;

    if (skipped === 0) {
      return this.importedMessage;
    }

    const alreadyPresent = skipped === 1
      ? '1 spesa era già presente.'
      : `${skipped} spese erano già presenti.`;

    return `${this.importedMessage} ${alreadyPresent}`;
  }

  categoryName(key: string): string {
    return CATEGORY_BY_KEY.get(key)?.name ?? key;
  }

  trackBatch(_index: number, batch: ImportBatch): number {
    return batch.id;
  }

  private formatDateTime(value: string): string {
    const date = new Date(value);
    const day = new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
    const time = new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

    return `${day} alle ${time}`;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR'
    });
  }
}
