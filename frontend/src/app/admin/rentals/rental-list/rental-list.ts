import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RentalService } from '../../../services/rental.service';
import { ContractService } from '../../../services/contract.service';
import { Rental } from '../../../models/rental.model';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-rental-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './rental-list.html',
    styleUrl: './rental-list.scss',
})
export class RentalListComponent implements OnInit {
    rentals$: Observable<Rental[]> | undefined;

    constructor(
        private rentalService: RentalService,
        private contractService: ContractService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadRentals();
    }

    loadRentals(): void {
        this.rentals$ = this.rentalService.getActiveRentals();
    }

    returnVehicle(rental: Rental): void {
        if (!rental.id) return;

        Swal.fire({
            title: 'Finalizar Alquiler',
            html: `
                <div class="text-left space-y-6">
                    <div class="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-bold text-slate-600 dark:text-slate-400">Vehículo</p>
                                <p class="text-lg font-black text-slate-900 dark:text-white">${rental.vehicle?.brand} ${rental.vehicle?.model}</p>
                            </div>
                            <span class="text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400">
                                ${rental.vehicle?.plate}
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Kilometraje Inicial
                        </label>
                        <input type="text" value="${rental.initialMileage} KM" class="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-bold" readonly disabled>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                            Kilometraje Final
                        </label>
                        <input type="number" id="finalMileage" class="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-2xl font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all" placeholder="Ingrese kilometraje">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Confirmar Entrega',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#059669',
            cancelButtonColor: '#64748b',
            width: '600px',
            padding: '2rem',
            customClass: {
                popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl',
                title: 'text-2xl font-black text-slate-900 dark:text-white',
                confirmButton: 'rounded-xl font-bold px-8 py-3 shadow-lg',
                cancelButton: 'rounded-xl font-bold px-8 py-3'
            },
            preConfirm: () => {
                const finalMileageInput = document.getElementById('finalMileage') as HTMLInputElement;
                const finalMileage = finalMileageInput.value;
                if (!finalMileage) {
                    Swal.showValidationMessage('Por favor ingrese el kilometraje final');
                    return false;
                }
                const mileage = parseInt(finalMileage);
                if (mileage < rental.initialMileage) {
                    Swal.showValidationMessage(`El kilometraje final debe ser mayor al inicial (${rental.initialMileage})`);
                    return false;
                }
                return mileage;
            }
        }).then((result) => {
            if (result.isConfirmed && typeof result.value === 'number') {
                this.rentalService.completeRental(rental.id!, {
                    finalMileage: result.value,
                    returnDate: new Date().toISOString()
                }).subscribe({
                    next: () => {
                        this.loadRentals();
                        this.cdr.detectChanges();
                        Swal.fire({
                            title: '¡Éxito!',
                            text: 'El vehículo ha sido retornado correctamente.',
                            icon: 'success',
                            confirmButtonColor: '#059669',
                            timer: 2500,
                            timerProgressBar: true
                        });
                    },
                    error: () => {
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo completar el proceso. Intente de nuevo.',
                            icon: 'error',
                            confirmButtonColor: '#059669'
                        });
                    }
                });
            }
        });
    }

    generateContract(rental: Rental): void {
        if (rental.id) {
            this.contractService.downloadContract(rental.id);
        }
    }

}
