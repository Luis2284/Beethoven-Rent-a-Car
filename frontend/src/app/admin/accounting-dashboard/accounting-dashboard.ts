import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountingService, BalanceSummary, TransactionItem } from '../../services/accounting.service';
import { AdministratorService } from '../../services/administrator.service';
import { VehicleService } from '../../services/vehicle.service';
import { Administrator } from '../../models/administrator.model';
import { Vehicle } from '../../models/vehicle.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-accounting-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './accounting-dashboard.html',
  styleUrl: './accounting-dashboard.scss',
})
export class AccountingDashboardComponent implements OnInit {
  balance: BalanceSummary = { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
  transactions: TransactionItem[] = [];

  // Filters
  startDate: Date | null = null;
  endDate: Date | null = null;
  activeRangeType: 'thisMonth' | 'lastMonth' | 'year' | 'all' | 'custom' = 'thisMonth';

  administrators: Administrator[] = [];
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];

  selectedAdminId: number | undefined;
  selectedVehicleId: number | undefined;

  displayedColumns: string[] = ['date', 'description', 'type', 'amount'];

  constructor(
    private accountingService: AccountingService,
    private adminService: AdministratorService,
    private vehicleService: VehicleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setDateFilter('thisMonth');
    this.loadFilters();
  }

  loadFilters(): void {
    forkJoin({
      admins: this.adminService.getAdministrators(),
      vehicles: this.vehicleService.getVehicles()
    }).subscribe(({ admins, vehicles }) => {
      this.administrators = admins;
      this.vehicles = vehicles;
      this.filteredVehicles = vehicles; // Default to all if no admin selected
      this.loadData();
    });
  }

  loadData(): void {
    const start = this.startDate ?? undefined;
    const end = this.endDate ?? undefined;

    this.accountingService.getBalance(start, end, this.selectedAdminId, this.selectedVehicleId).subscribe(data => {
      this.balance = data;
      this.cdr.detectChanges();
    });

    this.accountingService.getTransactions(start, end, this.selectedAdminId, this.selectedVehicleId).subscribe(data => {
      this.transactions = data;
      this.cdr.detectChanges();
    });
  }

  onAdminChange(): void {
    if (this.selectedAdminId) {
      // Filter vehicles belonging to this admin
      // Ensure we compare strings/numbers correctly if types differ, but both should be number
      this.filteredVehicles = this.vehicles.filter(v => v.administratorId == this.selectedAdminId);
    } else {
      this.filteredVehicles = this.vehicles;
    }

    // Reset vehicle selection if it's no longer in the list (or always reset to be safe)
    this.selectedVehicleId = undefined;

    this.loadData();
  }

  onVehicleChange(): void {
    this.loadData();
  }

  onDateChange(): void {
    // If user manually changes the date inputs, switch to custom mode
    this.activeRangeType = 'custom';
    this.loadData();
  }

  setDateFilter(range: 'thisMonth' | 'lastMonth' | 'year' | 'all' | 'custom'): void {
    this.activeRangeType = range;
    const now = new Date();

    if (range === 'thisMonth') {
      this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (range === 'lastMonth') {
      this.startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      this.endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (range === 'year') {
      this.startDate = new Date(now.getFullYear(), 0, 1);
      this.endDate = new Date(now.getFullYear(), 11, 31);
    } else if (range === 'all') {
      this.startDate = null;
      this.endDate = null;
    } else if (range === 'custom') {
      // Don't change dates, let user pick
    }
    this.loadData();
  }

  getFilterLabel(range: string): string {
    const now = new Date();
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    if (range === 'thisMonth') {
      return `(${monthNames[now.getMonth()]})`;
    } else if (range === 'lastMonth') {
      const lastMonthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      return `(${monthNames[lastMonthIndex]})`;
    } else if (range === 'year') {
      return `(${now.getFullYear()})`;
    }
    return '';
  }
}
