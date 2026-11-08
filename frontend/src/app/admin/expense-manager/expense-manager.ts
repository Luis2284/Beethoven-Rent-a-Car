import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { VehicleService } from '../../services/vehicle.service';
import { Expense } from '../../models/expense.model';
import { Vehicle } from '../../models/vehicle.model';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-expense-manager',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule
  ],
  providers: [],
  templateUrl: './expense-manager.html',
  styleUrl: './expense-manager.scss'
})
export class ExpenseManagerComponent implements OnInit, OnDestroy {
  vehicleId!: number;
  vehicle?: Vehicle;
  expenses: Expense[] = [];
  expenseForm: FormGroup;
  showForm = false;
  errorMessage: string = '';
  isLoading = true;

  private route = inject(ActivatedRoute);
  private expenseService = inject(ExpenseService);
  private vehicleService = inject(VehicleService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions: Subscription[] = [];

  constructor() {
    this.expenseForm = this.fb.group({
      date: [new Date().toISOString().slice(0, 10), Validators.required],
      type: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.maxLength(200)]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleId = +id;
      this.loadVehicle();
      this.loadExpenses();
    } else {
      this.errorMessage = 'No se especificó un vehículo.';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadVehicle() {
    const sub = this.vehicleService.getVehicle(this.vehicleId).subscribe({
      next: (v) => this.vehicle = v,
      error: (e) => {
        console.error('Error loading vehicle', e);
        this.errorMessage = 'Error cargando datos del vehículo.';
      }
    });
    this.subscriptions.push(sub);
  }

  loadExpenses() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const sub = this.expenseService.getExpensesByVehicle(this.vehicleId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (e) => this.expenses = e,
        error: (e) => {
          console.error('Error loading expenses', e);
          this.errorMessage = 'Error cargando gastos.';
        }
      });
    this.subscriptions.push(sub);
  }

  onSubmit() {
    if (this.expenseForm.invalid) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    const newExpense: Expense = {
      ...this.expenseForm.value,
      vehicleId: this.vehicleId
    };

    const sub = this.expenseService.createExpense(newExpense)
      .pipe(finalize(() => {
        //
      }))
      .subscribe(() => {
        this.loadExpenses();
        this.expenseForm.reset({
          date: new Date().toISOString().slice(0, 10),
          type: '',
          amount: 0,
          description: ''
        });
        this.showForm = false;
      });
    this.subscriptions.push(sub);
  }

  deleteExpense(id?: number) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      const sub = this.expenseService.deleteExpense(id).subscribe(() => this.loadExpenses());
      this.subscriptions.push(sub);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }
}
