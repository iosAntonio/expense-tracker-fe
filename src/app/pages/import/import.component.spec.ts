import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';
import { ImportBatch } from '../../services/expense.service';
import { ImportComponent } from './import.component';

async function waitUntil(condition: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 100 && !condition(); attempt++) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function batch(overrides: Partial<ImportBatch> = {}): ImportBatch {
  return {
    id: 1,
    fileName: 'ottobre.json',
    importedAt: '2026-11-25T14:02:00Z',
    rowCount: 2,
    importedCount: 2,
    skippedCount: 0,
    revertedAt: null,
    ...overrides,
  };
}

describe('ImportComponent', () => {
  const importsUrl = `${environment.apiUrl}/imports`;
  const importUrl = `${environment.apiUrl}/expenses/import`;
  const validRows = [
    {
      externalId: 'a-1',
      date: '2026-10-02',
      description: 'Spesa',
      amount: 42.5,
      category: 'ALIMENTARI',
      paymentMethod: 'Carta',
    },
    { externalId: 'a-2', date: '2026-10-05', amount: 12, category: 'BAR_RISTORAZIONE' },
  ];

  let fixture: ComponentFixture<ImportComponent>;
  let component: ImportComponent;
  let httpMock: HttpTestingController;
  let toast: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ImportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);
    spyOn(toast, 'success');
    spyOn(toast, 'error');
    fixture.detectChanges();
    respondToHistory([]);
  });

  afterEach(() => httpMock.verify());

  function text(): string {
    return fixture.nativeElement.textContent;
  }

  function respondToHistory(batches: ImportBatch[]): void {
    httpMock.expectOne(req => req.method === 'GET' && req.url === importsUrl).flush(batches);
    fixture.detectChanges();
  }

  async function dropFile(content: string, name = 'spese.json'): Promise<void> {
    const file = new File([content], name, { type: 'application/json' });
    const event = { preventDefault: () => undefined, dataTransfer: { files: [file] } };

    component.onDrop(event as unknown as DragEvent);
    await waitUntil(() => component.expenses.length > 0 || component.errors.length > 0);
    fixture.detectChanges();
  }

  async function dropValidFile(previousImports: ImportBatch[] = []): Promise<void> {
    await dropFile(JSON.stringify(validRows));
    const check = httpMock.expectOne(`${importsUrl}/check`);
    expect(check.request.body.map((row: { externalId: string }) => row.externalId)).toEqual([
      'a-1',
      'a-2',
    ]);
    check.flush({ previousImports });
    fixture.detectChanges();
  }

  function confirmImport(response: object): void {
    component.confirmImport();
    const request = httpMock.expectOne(req => req.method === 'POST' && req.url === importUrl);
    expect(request.request.params.get('fileName')).toBe('spese.json');
    expect(request.request.body.map((row: { externalId: string }) => row.externalId)).toEqual([
      'a-1',
      'a-2',
    ]);
    request.flush(response);
    fixture.detectChanges();
  }

  it('previews a valid file and enables the import once the check is done', async () => {
    await dropFile(JSON.stringify(validRows));

    expect(component.errors).toEqual([]);
    expect(component.expenses.length).toBe(2);
    expect(component.expenses[1].description).toBeNull();
    expect(component.totalAmount).toBe(54.5);
    expect(component.canImport).toBeFalse();

    httpMock.expectOne(`${importsUrl}/check`).flush({ previousImports: [] });

    expect(component.canImport).toBeTrue();
    expect(component.previousImportMessage).toBeNull();
  });

  it('warns when the same content was already imported', async () => {
    await dropValidFile([batch({ fileName: 'ottobre-2026.json' })]);

    expect(component.previousImportMessage).toContain('è già stato importato il 25/11/2026');
    expect(component.previousImportMessage).toContain('«ottobre-2026.json» (2 spese)');
    expect(fixture.nativeElement.querySelector('.duplicate-warning')).not.toBeNull();
    expect(component.canImport).toBeTrue();
  });

  it('lists every invalid row and does not check or allow the import', async () => {
    await dropFile(
      JSON.stringify([
        validRows[0],
        { ...validRows[1], externalId: 'a-1' },
        { externalId: 'b-1', date: '2026-02-30', amount: 1, category: 'ALTRO' },
        { externalId: 'b-2', date: '2026-10-01', amount: 1.234, category: 'ALTRO' },
        { externalId: 'b-3', date: '2026-10-01', amount: 5, category: 'FOO' },
      ])
    );

    expect(component.expenses).toEqual([]);
    expect(component.errors).toEqual([
      'Riga 2: externalId duplicato (a-1).',
      'Riga 3: data non valida. Usa YYYY-MM-DD.',
      'Riga 4: importo non valido. Deve essere positivo e avere massimo 2 decimali.',
      'Riga 5: categoria non riconosciuta.',
    ]);
    expect(component.canImport).toBeFalse();
  });

  it('refuses files that are not JSON', async () => {
    await dropFile('a;b;c', 'spese.csv');

    expect(component.errors).toEqual(['Seleziona un file con estensione .json']);
  });

  it('reports imported and skipped expenses and can undo the import right away', async () => {
    await dropValidFile();
    confirmImport({
      totalReceived: 2,
      importedCount: 1,
      alreadyImportedCount: 1,
      batch: batch({ id: 7, rowCount: 2, importedCount: 1, skippedCount: 1 }),
      importedExpenses: [
        {
          id: 7,
          date: '2026-10-05',
          description: null,
          amount: 12,
          category: 'BAR_RISTORAZIONE',
          paymentMethod: null,
        },
      ],
      skippedExternalIds: ['a-1'],
    });
    respondToHistory([batch({ id: 7 })]);

    expect(text()).toContain('1 spesa importata correttamente.');
    expect(text()).toContain('1 spesa era già presente ed è stata saltata (a-1).');
    expect(toast.success).toHaveBeenCalledWith(
      '1 spesa importata correttamente. 1 spesa era già presente.'
    );

    const undo = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.success-card .danger-button');
    undo().click();
    fixture.detectChanges();
    expect(undo().textContent).toContain('Conferma annullamento');
    httpMock.expectNone(`${importsUrl}/7/revert`);

    undo().click();
    httpMock
      .expectOne(`${importsUrl}/7/revert`)
      .flush({ batch: batch({ id: 7, revertedAt: '2026-11-25T15:00:00Z' }), removedCount: 1 });
    respondToHistory([batch({ id: 7, revertedAt: '2026-11-25T15:00:00Z' })]);

    expect(text()).toContain('Import annullato: 1 spesa rimossa.');
    expect(toast.success).toHaveBeenCalledWith('Import annullato: 1 spesa rimossa.');
    expect(undo()).toBeNull();
  });

  it('says so when every expense was already present and offers nothing to undo', async () => {
    await dropValidFile();
    confirmImport({
      totalReceived: 2,
      importedCount: 0,
      alreadyImportedCount: 2,
      batch: null,
      importedExpenses: [],
      skippedExternalIds: ['a-1', 'a-2'],
    });
    respondToHistory([]);

    expect(component.importedMessage).toBe('Nessuna nuova spesa importata.');
    expect(component.skippedMessage).toBe(
      '2 spese erano già presenti e sono state saltate (a-1, a-2).'
    );
    expect(fixture.nativeElement.querySelector('.success-card .danger-button')).toBeNull();
    expect(toast.success).toHaveBeenCalledWith(
      'Nessuna nuova spesa importata. 2 spese erano già presenti.'
    );
  });

  it('shows the message returned by the API when the import fails', async () => {
    await dropValidFile();
    component.confirmImport();

    httpMock
      .expectOne(req => req.method === 'POST' && req.url === importUrl)
      .flush({ message: 'Dati non validi.' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(component.importError).toBe('Dati non validi.');
    expect(component.importedCount).toBeNull();
    expect(toast.error).toHaveBeenCalledWith('Importazione non riuscita. Dati non validi.');
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('lists recent imports and reverts one after confirmation', () => {
    component.loadHistory();
    respondToHistory([
      batch({ id: 2, fileName: 'novembre.json' }),
      batch({ id: 1, revertedAt: '2026-11-25T15:00:00Z' }),
    ]);

    const rows: NodeListOf<HTMLTableRowElement> =
      fixture.nativeElement.querySelectorAll('.history-card tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('novembre.json');
    expect(rows[0].textContent).toContain('Attivo');
    expect(rows[1].textContent).toContain('Annullato il 25/11/2026');
    expect(rows[1].querySelector('button')).toBeNull();

    const revert = rows[0].querySelector('button') as HTMLButtonElement;
    revert.click();
    fixture.detectChanges();
    expect(revert.textContent).toContain('Conferma annullamento');

    revert.click();
    httpMock
      .expectOne(`${importsUrl}/2/revert`)
      .flush({ batch: batch({ id: 2, revertedAt: '2026-11-25T16:00:00Z' }), removedCount: 2 });
    respondToHistory([
      batch({ id: 2, fileName: 'novembre.json', revertedAt: '2026-11-25T16:00:00Z' }),
      batch({ id: 1, revertedAt: '2026-11-25T15:00:00Z' }),
    ]);

    expect(toast.success).toHaveBeenCalledWith('Import annullato: 2 spese rimosse.');
    expect(fixture.nativeElement.querySelectorAll('.history-card tbody button').length).toBe(0);
  });

  it('explains why a revert failed', () => {
    component.loadHistory();
    respondToHistory([batch({ id: 2 })]);

    const revert = fixture.nativeElement.querySelector('.history-card tbody button');
    revert.click();
    fixture.detectChanges();
    revert.click();
    httpMock
      .expectOne(`${importsUrl}/2/revert`)
      .flush(
        { message: 'Questo import è già stato annullato.' },
        { status: 409, statusText: 'Conflict' }
      );
    respondToHistory([batch({ id: 2, revertedAt: '2026-11-25T16:00:00Z' })]);

    expect(toast.error).toHaveBeenCalledWith('Questo import è già stato annullato.');
  });
});
