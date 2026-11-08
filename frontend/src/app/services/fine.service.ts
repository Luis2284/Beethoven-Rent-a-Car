import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fine {
    id?: number;
    vehicleId: number;
    referenceCode: string;
    reason: string;
    description?: string; // Added for UI compatibility
    amount: number;
    date: string;
    isPaid: boolean;
    paidDate?: string;
    vehicle?: any;
}

@Injectable({
    providedIn: 'root'
})
export class FineService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5159/api/fines';

    getFinesByVehicle(vehicleId: number): Observable<Fine[]> {
        return this.http.get<Fine[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
    }

    createFine(fine: Fine): Observable<Fine> {
        return this.http.post<Fine>(this.apiUrl, fine);
    }

    payFine(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/pay`, {});
    }

    checkSimit(plate: string): Observable<Fine | null> {
        return this.http.get<Fine>(`${this.apiUrl}/check-simit/${plate}`);
    }
}
