import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import {
  ExpenseImportRequest,
  ExpenseImportResponse,
  ExpenseResponse,
  ExpenseService,
  ExpenseUpdateRequest,
  ImportBatch,
} from './expense.service';

describe('ExpenseService', () => {
  const importsUrl = `${environment.apiUrl}/imports`;
  const rows: ExpenseImportRequest[] = [
    {
      externalId: 'a-1',
      date: '2026-10-02',
      description: null,
      amount: 10,
      category: 'ALTRO',
      paymentMethod: null,
    },
  ];
  const batch: ImportBatch = {
    id: 3,
    fileName: 'ottobre.json',
    importedAt: '2026-11-25T14:02:00Z',
    rowCount: 1,
    importedCount: 1,
    skippedCount: 0,
    revertedAt: null,
  };

  let service: ExpenseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ExpenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads all expenses from the API', () => {
    let result: ExpenseResponse[] | undefined;
    service.getAllExpenses().subscribe(expenses => (result = expenses));

    const request = httpMock.expectOne(`${environment.apiUrl}/expenses`);
    expect(request.request.method).toBe('GET');
    request.flush([]);

    expect(result).toEqual([]);
  });

  it('posts the rows to the import with the file name and returns the summary', () => {
    let result: ExpenseImportResponse | undefined;
    service.importExpenses('ottobre.json', rows).subscribe(response => (result = response));

    const request = httpMock.expectOne(req => req.url === `${environment.apiUrl}/expenses/import`);
    expect(request.request.method).toBe('POST');
    expect(request.request.params.get('fileName')).toBe('ottobre.json');
    expect(request.request.body).toEqual(rows);
    request.flush({
      totalReceived: 1,
      importedCount: 0,
      alreadyImportedCount: 1,
      importedExpenses: [],
      skippedExternalIds: ['a-1'],
      batch: null,
    });

    expect(result).toEqual({ batch: null, imported: [], skippedExternalIds: ['a-1'] });
  });

  it('asks whether the same content was already imported', () => {
    service.checkImport(rows).subscribe();

    const request = httpMock.expectOne(`${importsUrl}/check`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(rows);
    request.flush({ previousImports: [] });
  });

  it('lists the imports and reverts one of them', () => {
    service.getImports().subscribe();
    const list = httpMock.expectOne(importsUrl);
    expect(list.request.method).toBe('GET');
    list.flush([batch]);

    service.revertImport(3).subscribe();
    const revert = httpMock.expectOne(`${importsUrl}/3/revert`);
    expect(revert.request.method).toBe('POST');
    revert.flush({ batch: { ...batch, revertedAt: '2026-11-25T15:00:00Z' }, removedCount: 1 });
  });

  it('updates or deletes one expense and deletes a whole month', () => {
    const update: ExpenseUpdateRequest = {
      date: '2026-10-03',
      description: 'Spesa corretta',
      amount: 40.1,
      category: 'CASA',
      paymentMethod: null,
    };

    service.updateExpense(5, update).subscribe();
    const put = httpMock.expectOne(`${environment.apiUrl}/expenses/5`);
    expect(put.request.method).toBe('PUT');
    expect(put.request.body).toEqual(update);
    put.flush({ id: 5, ...update });

    service.deleteExpense(5).subscribe();
    const remove = httpMock.expectOne(`${environment.apiUrl}/expenses/5`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush(null);

    service.deleteMonth('2026-10').subscribe();
    const month = httpMock.expectOne(
      req => req.method === 'DELETE' && req.url === `${environment.apiUrl}/expenses`
    );
    expect(month.request.params.get('month')).toBe('2026-10');
    month.flush({ month: '2026-10', deletedCount: 3 });
  });
});
