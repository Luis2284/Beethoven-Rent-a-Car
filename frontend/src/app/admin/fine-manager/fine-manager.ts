import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FineService, Fine } from '../../services/fine.service';

@Component({
    selector: 'app-fine-manager',
    standalone: true,
    imports: [
        CommonModule, FormsModule
    ],
    templateUrl: './fine-manager.html',
    styleUrl: './fine-manager.scss'
})
export class FineManagerComponent {
    private fineService = inject(FineService);

    searchPlate: string = '';
    isLoading = false;
    simitResult: Fine | null = null;
    simitNotFound = false;

    fines: Fine[] = [];

    checkSimit() {
        if (!this.searchPlate) return;

        this.isLoading = true;
        this.simitResult = null;
        this.simitNotFound = false;

        this.fineService.checkSimit(this.searchPlate).subscribe({
            next: (fine) => {
                this.isLoading = false;
                if (fine) {
                    this.simitResult = fine;
                } else {
                    this.simitNotFound = true;
                }
            },
            error: (err) => {
                this.isLoading = false;
                if (err.status === 404) {
                    this.simitNotFound = true;
                } else {
                    alert('Error consultando SIMIT');
                }
            }
        });
    }

    registerFine() {
        if (this.simitResult) {
            this.fineService.createFine(this.simitResult).subscribe(savedFine => {
                alert('Multa Registrada');
                this.fines.unshift(savedFine); // Add to list
                this.simitResult = null;
            });
        }
    }

    payFine(fine: Fine) {
        if (fine.id) {
            this.fineService.payFine(fine.id).subscribe(() => {
                fine.isPaid = true;
                fine.paidDate = new Date().toISOString();
                alert('Multa Pagada');
            });
        }
    }
}
