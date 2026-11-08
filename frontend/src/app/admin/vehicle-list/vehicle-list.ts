import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleListComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  errorMessage: string = '';
  isLoading = true;
  private subscription: Subscription | null = null;
  private cdr = inject(ChangeDetectorRef);

  constructor(private vehicleService: VehicleService) {
    console.log('VehicleListComponent constructed');
  }

  ngOnInit(): void {
    console.log('VehicleListComponent initialized');
    this.loadVehicles();
  }

  ngOnDestroy(): void {
    console.log('VehicleListComponent destroyed. Unsubscribing...');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadVehicles(): void {
    console.log('Loading vehicles triggered...');

    // Cleanup previous subscription if any
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Explicitly trigger CD to show loading spinner immediately
    this.cdr.detectChanges();

    this.subscription = this.vehicleService.getVehicles()
      .pipe(
        finalize(() => {
          console.log('Vehicle request finalized (completed or error).');
          this.isLoading = false;
          this.cdr.detectChanges(); // Force UI update
        })
      )
      .subscribe({
        next: (data) => {
          console.log('Vehicles loaded successfully:', data?.length);
          this.vehicles = data;
        },
        error: (error) => {
          console.error('Error fetching vehicles', error);
          this.errorMessage = 'Error conectando con el servidor. Asegúrate de que el Backend esté corriendo en el puerto 5159.';
        }
      });
  }

  toggleMaintenance(vehicle: Vehicle): void {
    if (!vehicle.id) return;

    const newStatus = (vehicle.status === 'Maintenance' ? 'Available' : 'Maintenance') as 'Available' | 'Maintenance';
    const updatedVehicle: Vehicle = { ...vehicle, status: newStatus };

    this.vehicleService.updateVehicle(vehicle.id, updatedVehicle).subscribe(() => {
      this.loadVehicles();
    });
  }
}
