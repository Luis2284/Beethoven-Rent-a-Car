import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService, MaintenanceAlert } from '../../services/maintenance.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-maintenance',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './maintenance.html',
})
export class MaintenanceComponent implements OnInit {
    pendingMaintenances: MaintenanceAlert[] = [];
    isLoading = true;

    constructor(
        private maintenanceService: MaintenanceService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadPending();
    }

    loadPending(): void {
        console.log('Loading pending maintenances...');
        this.isLoading = true;
        this.maintenanceService.getPendingMaintenances().subscribe({
            next: (data) => {
                console.log('Pending loaded:', data);
                this.pendingMaintenances = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading maintenance data', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getSeverityClass(status: string): string {
        return status === 'Overdue'
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-amber-50 text-amber-700 border-amber-200';
    }
}
