import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { AdministratorService } from '../../services/administrator.service';
import { Administrator } from '../../models/administrator.model';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss'
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  isEditMode = false;
  vehicleId?: number;
  administrators: Administrator[] = [];
  isUploadingImage = false;

  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private adminService = inject(AdministratorService);
  private uploadService = inject(UploadService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.vehicleForm = this.fb.group({
      plate: ['', [Validators.required, Validators.maxLength(10)]],
      color: ['', [Validators.required, Validators.maxLength(20)]],
      brand: ['', [Validators.required, Validators.maxLength(50)]],
      model: ['', [Validators.required, Validators.maxLength(50)]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      description: ['', [Validators.maxLength(200)]],
      administratorId: [null, Validators.required],
      imageUrl: [''] // URL of uploaded image
    });
  }

  ngOnInit() {
    this.loadAdministrators();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.vehicleId = +id;
      this.loadVehicle(this.vehicleId);
    }
  }

  loadAdministrators() {
    this.adminService.getAdministrators().subscribe(data => {
      this.administrators = data;
    });
  }

  loadVehicle(id: number) {
    this.vehicleService.getVehicle(id).subscribe(vehicle => {
      this.vehicleForm.patchValue(vehicle);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Starting upload...');
      this.isUploadingImage = true;
      this.uploadService.uploadFile(file).subscribe({
        next: (response) => {
          console.log('Upload success:', response);
          this.vehicleForm.patchValue({ imageUrl: response.path });
          this.isUploadingImage = false;
          this.cdr.detectChanges(); // Force update
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploadingImage = false;
          this.cdr.detectChanges(); // Force update
          alert('Error al subir la imagen. Revisa la consola.');
        }
      });
    }
  }

  onSubmit() {
    if (this.vehicleForm.invalid) {
      return;
    }

    const vehicleData: Vehicle = this.vehicleForm.value;

    if (this.isEditMode && this.vehicleId) {
      const vehicleUpdate = { ...vehicleData, id: this.vehicleId };
      this.vehicleService.updateVehicle(this.vehicleId, vehicleUpdate).subscribe(() => {
        this.router.navigate(['/vehicles']);
      });
    } else {
      this.vehicleService.createVehicle(vehicleData).subscribe(() => {
        this.router.navigate(['/vehicles']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/vehicles']);
  }
}
