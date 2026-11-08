import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { Rental } from '../../../models/rental.model';
import { Vehicle } from '../../../models/vehicle.model';

interface VehicleHistory {
  vehicle: Vehicle;
  rentals: Rental[];
  totalEarnings: number;
  totalTrips: number;
}

@Component({
  selector: 'app-vehicle-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-history.html',
  styleUrl: './vehicle-history.scss'
})
export class VehicleHistoryComponent implements OnInit {
  history$: Observable<VehicleHistory> | undefined;
  vehicleId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.vehicleId = +params['id'];
      if (this.vehicleId) {
        this.history$ = this.dashboardService.getVehicleHistory(this.vehicleId);
      }
    });
  }

  calculateDays(start: string, end: string): number {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 1 ? 1 : diffDays;
  }
}
