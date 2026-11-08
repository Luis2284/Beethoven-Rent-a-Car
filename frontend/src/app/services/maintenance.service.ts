import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MaintenanceConfig {
    id?: number;
    name: string;
    intervalMileage: number;
    alertThresholdKm: number;
}

export interface VehicleMaintenance {
    id?: number;
    vehicleId: number;
    maintenanceConfigId: number;
    datePerformed: string;
    mileageAtMaintenance: number;
    notes: string;
}

export interface MaintenanceAlert {
    vehicleId: number;
    plate: string;
    brand: string;
    model: string;
    maintenanceType: string;
    lastPerformedKm: number;
    currentMileage: number;
    nextDueKm: number;
    remainingKm: number;
    status: 'Overdue' | 'Warning';
}

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {
    private apiUrl = `${environment.apiUrl}/maintenance`;

    constructor(private http: HttpClient) { }

    getConfigs(): Observable<MaintenanceConfig[]> {
        return this.http.get<MaintenanceConfig[]>(`${this.apiUrl}/configs`);
    }

    createConfig(config: MaintenanceConfig): Observable<MaintenanceConfig> {
        return this.http.post<MaintenanceConfig>(`${this.apiUrl}/configs`, config);
    }

    getPendingMaintenances(): Observable<MaintenanceAlert[]> {
        return this.http.get<MaintenanceAlert[]>(`${this.apiUrl}/pending`);
    }

    getVehicleStatus(vehicleId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
    }

    registerMaintenance(maintenance: VehicleMaintenance): Observable<VehicleMaintenance> {
        return this.http.post<VehicleMaintenance>(`${this.apiUrl}/register`, maintenance);
    }
}
