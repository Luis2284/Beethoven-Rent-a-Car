import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private apiUrl = 'http://localhost:5159/api/vehicles';

    constructor(private http: HttpClient) { }

    getVehicles(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(this.apiUrl);
    }

    getVehicle(id: number): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
    }

    createVehicle(vehicle: Vehicle): Observable<Vehicle> {
        return this.http.post<Vehicle>(this.apiUrl, vehicle);
    }

    updateVehicle(id: number, vehicle: Vehicle): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, vehicle);
    }

    deleteVehicle(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getVehicleHistory(id: number, startDate?: string, endDate?: string): Observable<any> {
        let params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return this.http.get<any>(`${this.apiUrl}/${id}/history`, { params });
    }
}
