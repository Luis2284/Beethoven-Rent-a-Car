import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardService, DashboardData } from '../../services/dashboard.service';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink
  ],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.scss'
})
export class MainDashboardComponent implements OnInit {
  dashboardData$: Observable<DashboardData> | undefined;

  // Filters
  filterType: 'month' | 'year' | 'custom' = 'month';
  selectedDate: Date = new Date();
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Vehicle Search
  vehicles$: Observable<Vehicle[]> | undefined;
  selectedVehicleId: number | undefined;

  constructor(
    private dashboardService: DashboardService,
    private vehicleService: VehicleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.vehicles$ = this.vehicleService.getVehicles();
    this.applyFilters();
  }

  applyFilters(): void {
    let start: Date, end: Date;
    const now = new Date();

    if (this.filterType === 'month') {
      // Check if selectedDate is valid
      if (!this.selectedDate) this.selectedDate = new Date();
      start = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
      end = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1);
    } else if (this.filterType === 'year') {
      if (!this.selectedDate) this.selectedDate = new Date();
      start = new Date(this.selectedDate.getFullYear(), 0, 1);
      end = new Date(this.selectedDate.getFullYear() + 1, 0, 1);
    } else {
      start = this.startDate || now;
      end = this.endDate || now;
    }

    this.dashboardData$ = this.dashboardService.getDashboardData(start.toISOString(), end.toISOString());
  }

  goToHistory(): void {
    if (this.selectedVehicleId) {
      this.router.navigate(['/vehicles', this.selectedVehicleId, 'history']);
    }
  }
}
