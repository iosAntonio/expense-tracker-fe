
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private readonly apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<ExpenseResponse[]> {
    return this.http.get<ExpenseResponse[]>(this.apiUrl);
  }

  importExpenses(
    expenses: ExpenseImportRequest[]
  ): Observable<ExpenseResponse[]> {
    return this.http.post<ExpenseResponse[]>(
      `${this.apiUrl}/import`,
      expenses
    );
  }
}
