import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientListComponent implements OnInit {
  clients$: Observable<Client[]> | undefined;
  // displayedColumns no longer needed for custom HTML table, but keeping for reference or removing if unused. Removed usage in HTML.

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.refreshClients();
  }

  refreshClients(): void {
    this.clients$ = this.clientService.getClients();
  }

  deleteClient(id: number): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.refreshClients();
      });
    }
  }
}
