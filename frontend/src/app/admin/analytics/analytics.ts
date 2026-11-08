import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalService } from '../../services/rental.service';
import { Rental } from '../../models/rental.model';

import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class AnalyticsComponent implements OnInit {
  dataSource: Rental[] = [];

  // Calculated Metrics
  totalRevenue: number = 0;
  activeRentalsCount: number = 0;
  completedRentalsCount: number = 0;
  averageTicket: number = 0;

  constructor(
    private rentalService: RentalService,
    private contractService: ContractService,
    private cdr: ChangeDetectorRef
  ) {
  }



  openContract(rental: any): void {
    if (rental.id) {
      this.contractService.downloadContract(rental.id);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.rentalService.getRentals().subscribe(rentals => {
      this.dataSource = rentals;
      this.calculateMetrics();
    });
  }

  calculateMetrics() {
    if (this.dataSource.length === 0) return;

    this.totalRevenue = this.dataSource.reduce((sum, rental) => sum + (rental.totalCost || 0), 0);
    this.activeRentalsCount = this.dataSource.filter(r => r.status === 'Active').length;
    this.completedRentalsCount = this.dataSource.filter(r => r.status === 'Completed').length;
    this.averageTicket = this.dataSource.length > 0 ? this.totalRevenue / this.dataSource.length : 0;

    // Force UI Update
    this.cdr.detectChanges();
  }

  calculateDays(start: string, end: string | undefined): number {
    if (!end) return 0;
    const date1 = new Date(start);
    const date2 = new Date(end);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 1 ? 1 : diffDays;
  }
}
