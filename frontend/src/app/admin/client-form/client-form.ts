import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  isEditing = false;
  clientId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private uploadService: UploadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      representativeName: [''],
      representativeDocument: [''],
      licenseNumber: [''],
      documentUrl: [''],
      licenseUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.clientId = +params['id'];
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: number): void {
    this.clientService.getClient(id).subscribe(client => {
      this.clientForm.patchValue(client);
    });
  }

  onFileSelected(event: any, type: 'document' | 'license'): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (response) => {
          if (type === 'document') {
            this.clientForm.patchValue({ documentUrl: response.path });
          } else {
            this.clientForm.patchValue({ licenseUrl: response.path });
          }
          // Removed snackBar for now
        },
        error: () => {
          console.error('Upload failed');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const clientData = { ...this.clientForm.value, id: this.clientId ?? 0 };

      const request = this.isEditing
        ? this.clientService.updateClient(this.clientId!, clientData)
        : this.clientService.createClient(clientData);

      (request as any).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (err: any) => {
          console.error(err);
          this.isLoading = false;
          alert('Error al guardar el cliente.');
        }
      });
    }
  }
}
