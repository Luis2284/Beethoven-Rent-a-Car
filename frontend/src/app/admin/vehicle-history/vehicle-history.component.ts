import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';

interface Transaction {
    date: Date;
    type: 'income' | 'expense';
    amount: number;
    title: string;
    subtitle: string;
    category: string;
    icon: string;
}

@Component({
    selector: 'app-vehicle-history',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './vehicle-history.html',
})
export class VehicleHistoryComponent implements OnInit {
    history: any = null;
    transactions: Transaction[] = [];
    isLoading = true;
    startDate: string = '';
    endDate: string = '';
    vehicleId: number = 0;

    private route = inject(ActivatedRoute);
    private vehicleService = inject(VehicleService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.vehicleId = +id;
            this.loadHistory();
        }
    }

    loadHistory() {
        this.isLoading = true;

        // Parse dates if they exist
        const start = this.startDate ? new Date(this.startDate) : undefined;
        const end = this.endDate ? new Date(this.endDate) : undefined;

        this.vehicleService.getVehicleHistory(this.vehicleId).subscribe({
            next: (data) => { // Note: Frontend service updates needed to pass dates
                this.history = data;
                this.processTransactions();
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    processTransactions() {
        if (!this.history) return;

        const rentals: Transaction[] = (this.history.rentals || []).map((r: any) => ({
            date: new Date(r.startDate),
            type: 'income',
            amount: r.totalCost || 0,
            title: `Alquiler #${r.id}`,
            subtitle: `Cliente: ${r.client?.name || 'Desconocido'}`,
            category: 'Alquiler',
            icon: 'attach_money'
        }));

        const expenses: Transaction[] = (this.history.expenses || []).map((e: any) => ({
            date: new Date(e.date),
            type: 'expense',
            amount: e.amount || 0,
            title: e.type,
            subtitle: e.description || 'Sin descripción',
            category: 'Mantenimiento',
            icon: 'build'
        }));

        // Merge and sort desc
        this.transactions = [...rentals, ...expenses].sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    clearFilters() {
        this.startDate = '';
        this.endDate = '';
        this.loadHistory();
    }
}
