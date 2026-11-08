import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
    vehicleStats: {
        total: number;
        available: number;
        rented: number;
        maintenance: number;
    };
    financialStats: {
        income: number;
        expenses: number;
        balance: number;
    };
    topClients: {
        name: string;
        rentalsCount: number;
        totalSpent: number;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = 'http://localhost:5159/api/dashboard';

    constructor(private http: HttpClient) { }

    getDashboardData(startDate?: string, endDate?: string): Observable<DashboardData> {
        let params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        return this.http.get<DashboardData>(this.apiUrl, { params });
    }

    getVehicleHistory(id: number): Observable<any> {
        return this.http.get<any>(`http://localhost:5159/api/vehicles/${id}/history`);
    }
}
