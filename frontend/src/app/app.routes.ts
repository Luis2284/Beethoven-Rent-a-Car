import { Routes } from '@angular/router';
import { VehicleListComponent } from './admin/vehicle-list/vehicle-list';
import { VehicleFormComponent } from './admin/vehicle-form/vehicle-form';
import { ExpenseManagerComponent } from './admin/expense-manager/expense-manager';
import { ClientListComponent } from './admin/client-list/client-list';
import { ClientFormComponent } from './admin/client-form/client-form';
import { RentalListComponent } from './admin/rentals/rental-list/rental-list';
import { RentalFormComponent } from './admin/rentals/rental-form/rental-form';
import { AccountingDashboardComponent } from './admin/accounting-dashboard/accounting-dashboard';
import { MainDashboardComponent } from './admin/main-dashboard/main-dashboard';
import { VehicleHistoryComponent } from './admin/vehicle-history/vehicle-history.component';
import { AnalyticsComponent } from './admin/analytics/analytics';
import { NotificationManagerComponent } from './admin/notification-manager/notification-manager';
import { FineManagerComponent } from './admin/fine-manager/fine-manager';
import { AdministratorListComponent } from './admin/administrator-list/administrator-list';
import { AdministratorFormComponent } from './admin/administrator-form/administrator-form';
import { ContractsHistoryComponent } from './admin/contracts-history/contracts-history';

export const routes: Routes = [
    { path: 'vehicles', component: VehicleListComponent },
    { path: 'vehicles/new', component: VehicleFormComponent },
    { path: 'vehicles/edit/:id', component: VehicleFormComponent },
    { path: 'vehicles/:id/expenses', component: ExpenseManagerComponent },
    { path: 'clients', component: ClientListComponent },
    { path: 'clients/new', component: ClientFormComponent },
    { path: 'clients/edit/:id', component: ClientFormComponent },
    { path: 'rentals', component: RentalListComponent },
    { path: 'rentals/new', component: RentalFormComponent },
    { path: 'contracts-history', component: ContractsHistoryComponent },
    { path: 'administrators', component: AdministratorListComponent },
    { path: 'administrators/new', component: AdministratorFormComponent },
    { path: 'administrators/edit/:id', component: AdministratorFormComponent },
    { path: 'vehicles/:id/history', component: VehicleHistoryComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: 'accounting', component: AccountingDashboardComponent },
    { path: 'notifications', component: NotificationManagerComponent },
    { path: 'fines', component: FineManagerComponent },
    { path: 'dashboard', component: MainDashboardComponent },
    { path: 'maintenance', loadComponent: () => import('./admin/maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
    { path: 'maintenance/config', loadComponent: () => import('./admin/maintenance/maintenance-config/maintenance-config.component').then(m => m.MaintenanceConfigComponent) },
    { path: 'settings', loadComponent: () => import('./admin/settings/settings.component').then(m => m.SettingsComponent) },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
