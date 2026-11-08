import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental.model';

@Injectable({
    providedIn: 'root'
})
export class RentalService {
    private apiUrl = 'http://localhost:5159/api/rentals';

    constructor(private http: HttpClient) { }

    getRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(this.apiUrl);
    }

    getActiveRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.apiUrl}/active`);
    }

    createRental(rental: Rental): Observable<Rental> {
        return this.http.post<Rental>(this.apiUrl, rental);
    }

    completeRental(id: number, returnData: { finalMileage: number, returnDate: string }): Observable<Rental> {
        return this.http.put<Rental>(`${this.apiUrl}/${id}/complete`, returnData);
    }

    getRentalHistory(plate: string, date: Date | null): Observable<Rental[]> {
        let params = `?plate=${plate}`;
        if (date) {
            params += `&date=${date.toISOString()}`;
        }
        return this.http.get<Rental[]>(`${this.apiUrl}/history${params}`);
    }
}
