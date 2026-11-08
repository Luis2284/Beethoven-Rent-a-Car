import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './settings.component.html'
})
export class SettingsComponent {
    private apiUrl = 'http://localhost:5159/api/database';

    constructor(private http: HttpClient) { }

    exportDatabase() {
        window.open(`${this.apiUrl}/export`, '_blank');
    }

    importDatabase(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esto sobrescribirá la base de datos actual y requerirá un reinicio.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, restaurar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.uploadFile(file);
            }
        });
    }

    private uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        this.http.post(`${this.apiUrl}/import`, formData).subscribe({
            next: (res: any) => {
                Swal.fire('Restauración Programada', res.message, 'success');
            },
            error: (err) => {
                console.error(err);
                Swal.fire('Error', 'No se pudo subir el archivo.', 'error');
            }
        });
    }
}
