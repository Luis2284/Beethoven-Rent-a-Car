import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AdministratorService } from '../../services/administrator.service';
import { UploadService } from '../../services/upload.service';

@Component({
    selector: 'app-administrator-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './administrator-form.html',
    styleUrl: './administrator-form.scss'
})
export class AdministratorFormComponent implements OnInit {
    adminForm: FormGroup;
    isEditing = false;
    adminId: number | null = null;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private adminService: AdministratorService,
        private uploadService: UploadService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.adminForm = this.fb.group({
            name: ['', Validators.required],
            document: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            licenseNumber: ['', Validators.required],
            documentUrl: ['']
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditing = true;
                this.adminId = +params['id'];
                this.loadAdministrator(this.adminId);
            }
        });
    }

    loadAdministrator(id: number): void {
        this.adminService.getAdministrator(id).subscribe(admin => {
            this.adminForm.patchValue(admin);
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.uploadService.uploadFile(file).subscribe({
                next: (response) => {
                    this.adminForm.patchValue({ documentUrl: response.path });
                    // snackBar removed for now
                },
                error: () => {
                    console.error('Upload failed');
                }
            });
        }
    }

    onSubmit(): void {
        if (this.adminForm.valid) {
            this.isLoading = true;
            const adminData = { ...this.adminForm.value, id: this.adminId ?? 0 };

            const request = this.isEditing
                ? this.adminService.updateAdministrator(this.adminId!, adminData)
                : this.adminService.createAdministrator(adminData);

            (request as any).subscribe({
                next: () => {
                    this.router.navigate(['/administrators']);
                },
                error: (err: any) => {
                    console.error(err);
                    this.isLoading = false;
                    alert('Error al guardar el administrador.');
                }
            });
        }
    }
}
