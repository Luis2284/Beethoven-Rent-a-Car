import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorService } from '../../services/administrator.service';
import { Administrator } from '../../models/administrator.model';

import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-administrator-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './administrator-list.html',
    styleUrl: './administrator-list.scss',
})
export class AdministratorListComponent implements OnInit {
    // Extend the model locally for UI purposes
    administrators$: Observable<(Administrator & { role: string; status: string; initials: string; colorClass: string })[]> | undefined;
    displayedColumns: string[] = ['name', 'document', 'phone', 'city', 'licenseNumber', 'status', 'actions'];

    constructor(private adminService: AdministratorService) { }

    ngOnInit(): void {
        this.refreshAdministrators();
    }

    refreshAdministrators(): void {
        this.administrators$ = this.adminService.getAdministrators().pipe(
            // Mocking UI data that doesn't exist in backend yet
            map(admins => admins.map(admin => {
                const roles = ['Propietario', 'Encargado'];
                const statuses = ['Activo', 'Activo', 'Pendiente']; // More actives
                const colors = ['indigo', 'emerald', 'purple'];

                return {
                    ...admin,
                    role: roles[Math.floor(Math.random() * roles.length)],
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    initials: this.getInitials(admin.name),
                    colorClass: colors[Math.floor(Math.random() * colors.length)]
                };
            }))
        );
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    deleteAdministrator(id: number): void {
        if (confirm('¿Estás seguro de eliminar este administrador?')) {
            this.adminService.deleteAdministrator(id).subscribe(() => {
                this.refreshAdministrators();
            });
        }
    }
}
