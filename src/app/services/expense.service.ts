import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExpenseResponse {
  id: number;
  date: string;
  description: string | null;
  amount: number;
  category: string;
  paymentMethod: string | null;
}

export interface ExpenseImportRequest {
  externalId: string;
  date: string;
  description: string | null;
  amount: number;
  category: string;
  paymentMethod: string | null;
}

export interface ExpenseUpdateRequest {
  date: string;
  description: string | null;
  amount: number;
  category: string;
  paymentMethod: string | null;
}

export interface MonthDeletionResponse {
  month: string;
  deletedCount: number;
}

export interface ImportBatch {
  id: number;
  fileName: string;
  importedAt: string;
  rowCount: number;
  importedCount: number;
  skippedCount: number;
  revertedAt: string | null;
}

export interface ExpenseImportResponse {
  batch: ImportBatch | null;
  imported: ExpenseResponse[];
  skippedExternalIds: string[];
}

export interface ExpenseImportApiResponse {
  totalReceived: number;
  importedCount: number;
  alreadyImportedCount: number;
  importedExpenses: ExpenseResponse[];
  skippedExternalIds: string[];
  batch: ImportBatch | null;
}

export interface ImportCheckResponse {
  previousImports: ImportBatch[];
}

export interface ImportRevertResponse {
  batch: ImportBatch;
  removedCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private readonly apiUrl = `${environment.apiUrl}/expenses`;
  private readonly importsUrl = `${environment.apiUrl}/imports`;

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<ExpenseResponse[]> {
    return this.http.get<ExpenseResponse[]>(this.apiUrl);
  }

  updateExpense(
    id: number,
    request: ExpenseUpdateRequest
  ): Observable<ExpenseResponse> {
    return this.http.put<ExpenseResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteMonth(month: string): Observable<MonthDeletionResponse> {
    return this.http.delete<MonthDeletionResponse>(this.apiUrl, {
      params: { month }
    });
  }

  importExpenses(
    fileName: string,
    expenses: ExpenseImportRequest[]
  ): Observable<ExpenseImportResponse> {
    return this.http
      .post<ExpenseImportApiResponse>(`${this.apiUrl}/import`, expenses, {
        params: { fileName }
      })
      .pipe(
        map(response => ({
          batch: response.batch,
          imported: response.importedExpenses,
          skippedExternalIds: response.skippedExternalIds
        }))
      );
  }

  checkImport(
    expenses: ExpenseImportRequest[]
  ): Observable<ImportCheckResponse> {
    return this.http.post<ImportCheckResponse>(
      `${this.importsUrl}/check`,
      expenses
    );
  }

  getImports(): Observable<ImportBatch[]> {
    return this.http.get<ImportBatch[]>(this.importsUrl);
  }

  revertImport(id: number): Observable<ImportRevertResponse> {
    return this.http.post<ImportRevertResponse>(
      `${this.importsUrl}/${id}/revert`,
      {}
    );
  }
}
