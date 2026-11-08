import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private apiUrl = 'http://localhost:5159/api/upload';

    constructor(private http: HttpClient) { }

    uploadFile(file: File): Observable<{ path: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ path: string }>(this.apiUrl, formData);
    }
}
