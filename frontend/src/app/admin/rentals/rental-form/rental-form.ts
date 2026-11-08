import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RentalService } from '../../../services/rental.service';
import { ClientService } from '../../../services/client.service';
import { VehicleService } from '../../../services/vehicle.service';
import { AdministratorService } from '../../../services/administrator.service';
import { Client } from '../../../models/client.model';
import { Vehicle } from '../../../models/vehicle.model';
import { Administrator } from '../../../models/administrator.model';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-rental-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './rental-form.html',
  styleUrl: './rental-form.scss',
})
export class RentalFormComponent implements OnInit {
  rentalForm: FormGroup;
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  administrators: Administrator[] = [];
  isLoading = false;

  selectedVehicle: Vehicle | undefined;

  constructor(
    private fb: FormBuilder,
    private rentalService: RentalService,
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private adminService: AdministratorService,
    private uploadService: UploadService,
    private router: Router
  ) {
    this.rentalForm = this.fb.group({
      clientId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      startDate: [this.formatDate(new Date()), Validators.required],
      endDate: ['', Validators.required],
      dailyRate: ['', [Validators.required, Validators.min(0)]],
      initialMileage: ['', [Validators.required, Validators.min(0)]],
      guaranteeAmount: [1000000, [Validators.required, Validators.min(0)]],
      contractCity: ['Becerril', Validators.required],
      assignAdminId: [''],
      signedContractUrl: ['']
    });

    this.rentalForm.get('vehicleId')?.valueChanges.subscribe(vehicleId => {
      this.selectedVehicle = this.vehicles.find(v => v.id == vehicleId);
      this.rentalForm.patchValue({ assignAdminId: '' });

      if (this.selectedVehicle) {
        this.rentalForm.patchValue({ initialMileage: this.selectedVehicle.currentMileage });
      }
    });
  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(data => this.clients = data);
    this.vehicleService.getVehicles().subscribe(data => this.vehicles = data);
    this.adminService.getAdministrators().subscribe(data => this.administrators = data);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (response) => {
          this.rentalForm.patchValue({ signedContractUrl: response.path });
        },
        error: (err) => {
          console.error('Upload failed', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      this.isLoading = true;
      const formValue = this.rentalForm.value;
      const assignAdminId = formValue.assignAdminId;

      if (this.selectedVehicle && !this.selectedVehicle.administratorId && assignAdminId) {
        const updatedVehicle = { ...this.selectedVehicle, administratorId: assignAdminId };

        this.vehicleService.updateVehicle(this.selectedVehicle.id!, updatedVehicle).subscribe({
          next: () => {
            this.createRental(formValue);
          },
          error: (err) => {
            console.error('Error updating vehicle owner', err);
            this.isLoading = false;
            alert('Error al asignar el propietario al vehículo. Intente nuevamente.');
          }
        });
      } else {
        this.createRental(formValue);
      }
    }
  }

  createRental(data: any): void {
    const { assignAdminId, ...rentalData } = data;

    this.rentalService.createRental(rentalData).subscribe({
      next: () => {
        this.router.navigate(['/rentals']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Error al crear el alquiler. Verifique que el vehículo no esté alquilado.');
      }
    });
  }

  enableOwnerEdit(): void {
    if (this.selectedVehicle) {
      // Small hack to trick UI
      this.selectedVehicle = { ...this.selectedVehicle, administrator: undefined, administratorId: undefined };
      this.rentalForm.patchValue({ assignAdminId: '' });
    }
  }
}
