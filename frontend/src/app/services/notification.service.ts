import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppNotification {
    title: string;
    message: string;
    type: 'Info' | 'Warning' | 'Error';
    date: string;
    link?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:5159/api/notifications';

    constructor(private http: HttpClient) { }

    getNotifications(): Observable<AppNotification[]> {
        return this.http.get<AppNotification[]>(this.apiUrl);
    }
}
