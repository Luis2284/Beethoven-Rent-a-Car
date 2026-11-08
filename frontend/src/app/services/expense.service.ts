import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private apiUrl = 'http://localhost:5159/api/expenses';

    constructor(private http: HttpClient) { }

    getExpensesByVehicle(vehicleId: number): Observable<Expense[]> {
        return this.http.get<Expense[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
    }

    createExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(this.apiUrl, expense);
    }

    deleteExpense(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
