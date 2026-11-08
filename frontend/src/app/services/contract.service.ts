import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private apiUrl = `${environment.apiUrl}/contracts`;

    constructor(private http: HttpClient) { }

    generateContract(rentalId: number): Observable<string> {
        return this.http.get(`${this.apiUrl}/generate/${rentalId}`, { responseType: 'text' });
    }

    /**
     * Downloads the contract HTML from the backend and opens a print window.
     * @param rentalId The ID of the rental to generate the contract for.
     */
    downloadContract(rentalId: number): void {
        this.generateContract(rentalId).subscribe({
            next: (htmlContent) => {
                this.printContract(htmlContent);
            },
            error: (err) => {
                console.error('Error fetching contract:', err);
                alert('Error al generar el contrato. Por favor intente nuevamente.');
            }
        });
    }

    private printContract(content: string): void {
        const popup = window.open('', '_blank', 'width=900,height=800');

        if (popup) {
            popup.document.open();
            popup.document.write(content);
            popup.document.close();
            popup.focus();
            setTimeout(() => {
                popup.print();
            }, 500);
        } else {
            alert('Por favor permita las ventanas emergentes para imprimir el contrato.');
        }
    }
}
