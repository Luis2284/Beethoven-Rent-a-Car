import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RentalService } from '../../services/rental.service';
import { VehicleService } from '../../services/vehicle.service';
import { Rental } from '../../models/rental.model';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-contracts-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contracts-history.html',
  styleUrl: './contracts-history.scss'
})
export class ContractsHistoryComponent implements OnInit {
  plate: string = '';
  searchDate: Date | null = null;
  foundRental: Rental | null = null;
  isLoading = false;
  apiUrl = 'http://localhost:5159/'; // For images

  vehicles: Vehicle[] = [];
  allRentals: Rental[] = [];

  constructor(
    private rentalService: RentalService,
    private vehicleService: VehicleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadAllRentals();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.cdr.detectChanges(); // Fix NG0100
    });
  }

  loadAllRentals(): void {
    this.rentalService.getRentals().subscribe(data => {
      this.allRentals = data;
      this.cdr.detectChanges(); // Fix NG0100
    });
  }

  search(): void {
    if (!this.plate) {
      alert('Por favor selecciona un vehículo');
      return;
    }

    this.isLoading = true;
    this.foundRental = null;

    this.rentalService.getRentalHistory(this.plate, this.searchDate).subscribe({
      next: (rentals) => {
        this.allRentals = rentals; // Update table with results
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        alert('Error al buscar historial');
      }
    });
  }

  selectRentalFromTable(rental: Rental): void {
    this.plate = rental.vehicle?.plate || '';
    if (rental.startDate) {
      this.searchDate = new Date(rental.startDate);
    }
    this.foundRental = rental;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openDocument(url?: string): void {
    if (url) {
      window.open(this.apiUrl + url, '_blank');
    } else {
      alert('Documento no disponible');
    }
  }
}
