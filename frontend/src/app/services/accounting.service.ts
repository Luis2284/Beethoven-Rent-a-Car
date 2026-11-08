import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BalanceSummary {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
}

export interface TransactionItem {
    date: string;
    description: string;
    amount: number;
    type: string;
    referenceId: number;
}

@Injectable({
    providedIn: 'root'
})
export class AccountingService {
    private apiUrl = 'http://localhost:5159/api/accounting';

    constructor(private http: HttpClient) { }

    getBalance(startDate?: Date | string, endDate?: Date | string, adminId?: number, vehicleId?: number): Observable<BalanceSummary> {
        let params: any = {};
        if (startDate) params.startDate = new Date(startDate).toISOString();
        if (endDate) params.endDate = new Date(endDate).toISOString();
        if (adminId) params.administratorId = adminId;
        if (vehicleId) params.vehicleId = vehicleId;

        return this.http.get<BalanceSummary>(`${this.apiUrl}/balance`, { params });
    }

    getTransactions(startDate?: Date | string, endDate?: Date | string, adminId?: number, vehicleId?: number): Observable<TransactionItem[]> {
        let params: any = {};
        if (startDate) params.startDate = new Date(startDate).toISOString();
        if (endDate) params.endDate = new Date(endDate).toISOString();
        if (adminId) params.administratorId = adminId;
        if (vehicleId) params.vehicleId = vehicleId;

        return this.http.get<TransactionItem[]>(`${this.apiUrl}/transactions`, { params });
    }
}
