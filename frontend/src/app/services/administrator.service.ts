import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrator } from '../models/administrator.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdministratorService {
    private apiUrl = `${environment.apiUrl}/administrators`;

    constructor(private http: HttpClient) { }

    getAdministrators(): Observable<Administrator[]> {
        return this.http.get<Administrator[]>(this.apiUrl);
    }

    getAdministrator(id: number): Observable<Administrator> {
        return this.http.get<Administrator>(`${this.apiUrl}/${id}`);
    }

    createAdministrator(admin: Administrator): Observable<Administrator> {
        return this.http.post<Administrator>(this.apiUrl, admin);
    }

    updateAdministrator(id: number, admin: Administrator): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, admin);
    }

    deleteAdministrator(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
