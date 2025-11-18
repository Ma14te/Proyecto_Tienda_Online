import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css'],
  standalone: true
})
export class MyOrders implements OnInit {
  pedidos: any[] = [];
  cargando: boolean = true;
  error: string | null = null;
  nombreUsuario: string = 'Usuario';
  emailUsuario: string = '';
  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return; // No ejecutar en el servidor
    }
    this.cargarDatosUsuario();
    this.cargarPedidos();
  }

  cargarDatosUsuario(): void {
    if (!this.isBrowser) return;
    
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        this.nombreUsuario = userData.nombre || 'Usuario';
        this.emailUsuario = userData.email || '';
      } catch (e) {
        console.error('Error al parsear datos de usuario', e);
      }
    }
  }

  cargarPedidos(): void {
    if (!this.isBrowser) {
      this.cargando = false;
      return;
    }

    this.apiService.obtenerMisPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.error = 'No se pudieron cargar los pedidos.';
        this.cargando = false;
      }
    });
  }

  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }
}