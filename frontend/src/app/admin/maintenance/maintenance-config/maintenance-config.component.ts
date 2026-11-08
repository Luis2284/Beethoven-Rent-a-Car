import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaintenanceService, MaintenanceConfig } from '../../../services/maintenance.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-maintenance-config',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './maintenance-config.html',
})
export class MaintenanceConfigComponent implements OnInit {
    configForm: FormGroup;
    configs: MaintenanceConfig[] = [];
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private maintenanceService: MaintenanceService,
        private cdr: ChangeDetectorRef
    ) {
        this.configForm = this.fb.group({
            name: ['', Validators.required],
            intervalMileage: ['', [Validators.required, Validators.min(1)]],
            alertThresholdKm: [500, [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit(): void {
        this.loadConfigs();
    }

    loadConfigs(): void {
        console.log('Reloading configs...');
        this.isLoading = true;
        this.maintenanceService.getConfigs().subscribe({
            next: (data) => {
                console.log('Configs loaded - Forcing update', data);
                this.configs = data;
                this.isLoading = false;
                this.cdr.detectChanges(); // Force UI update
            },
            error: (err) => {
                console.error('Error loading:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onSubmit(): void {
        if (this.configForm.valid) {
            console.log('Submitting config', this.configForm.value);
            this.maintenanceService.createConfig(this.configForm.value).subscribe({
                next: (res) => {
                    console.log('Config created', res);
                    this.loadConfigs();
                    this.configForm.reset({ alertThresholdKm: 500 });
                },
                error: (err) => {
                    console.error('Error creating config', err);
                    alert('Error al crear la configuración');
                }
            });
        } else {
            console.warn('Form invalid', this.configForm.errors);
        }
    }
}
