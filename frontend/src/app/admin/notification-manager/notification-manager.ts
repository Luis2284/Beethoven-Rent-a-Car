import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
    selector: 'app-notification-manager',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule
    ],
    templateUrl: './notification-manager.html',
    styleUrl: './notification-manager.scss'
})
export class NotificationManagerComponent implements OnInit {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private clientService = inject(ClientService);
    private cdr = inject(ChangeDetectorRef);

    history: any[] = [];
    clients: Client[] = [];
    notificationForm: FormGroup;
    isSending = false;
    private apiUrl = 'http://localhost:5159/api/notifications';

    constructor() {
        this.notificationForm = this.fb.group({
            clientId: [null], // Optional client
            title: ['', Validators.required],
            type: ['Info', Validators.required],
            message: ['', Validators.required],
            sendWhatsApp: [true] // Default to true
        });
    }

    ngOnInit() {
        this.loadHistory();
        this.loadClients();
    }

    loadHistory() {
        this.http.get<any[]>(`${this.apiUrl}/history`).subscribe(
            data => {
                this.history = data;
                this.cdr.detectChanges(); // Fix NG0100
            },
            error => console.error('Error loading history', error)
        );
    }

    loadClients() {
        this.clientService.getClients().subscribe(data => this.clients = data);
    }

    sendNotification() {
        if (this.notificationForm.valid) {
            this.isSending = true;
            const formValue = this.notificationForm.value;

            const payload = {
                title: formValue.title,
                message: formValue.message,
                type: formValue.type,
                clientId: formValue.clientId,
                isRead: false,
                createdAt: new Date().toISOString()
            };

            // 1. WhatsApp Logic
            if (formValue.sendWhatsApp && formValue.clientId) {
                const client = this.clients.find(c => c.id == formValue.clientId);
                if (client && client.phone) {
                    const phone = client.phone.replace(/\D/g, ''); // Remove non-digits
                    const text = encodeURIComponent(formValue.message);
                    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                }
            }

            // 2. Save Log to Backend
            this.http.post(`${this.apiUrl}/send`, payload).subscribe({
                next: (res) => {
                    alert('Notificación registrada');
                    this.isSending = false;
                    this.notificationForm.reset({ type: 'Info', sendWhatsApp: true });
                    this.loadHistory();
                },
                error: (err) => {
                    alert('Error al guardar');
                    this.isSending = false;
                }
            });
        }
    }
}
