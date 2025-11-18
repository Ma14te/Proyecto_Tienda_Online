
import { Component, signal, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth'; // <-- Importamos el servicio modificado
import { CartService } from './services/cart';
import { ApiService } from './services/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('tienda_online');
  
  // Estas variables locales ya no son necesarias para el estado de auth.
  cartCount = 0;
  busqueda = '';
  categoriaSeleccionada = '';
  categorias: any[] = [];
  
  private cartSubscription: Subscription | undefined;
  private authSubscription: Subscription | undefined; // Para forzar re-renderizado

  // Inyectamos el AuthService para usarlo en los getters
  constructor(
    public authService: AuthService, // <-- MODIFICADO: Hecho público
    private cartService: CartService,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef // <-- Inyectamos ChangeDetectorRef
  ) {}

  // --- NUEVOS GETTERS ---
  // El template (app.html) usará estos getters, que leen
  // directamente las propiedades públicas del AuthService.
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get nombreUsuario(): string {
    return this.authService.nombreUsuario;
  }
  // -----------------------

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    // Mantenemos la suscripción al carrito
    this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
      this.cdr.detectChanges();
    });

    // --- NUEVA LÓGICA DE SUSCRIPCIÓN ---
    // Solo nos suscribimos para saber CUANDO (login/logout)
    // forzar una actualización, no para *manejar* el estado.
    this.authSubscription = this.authService.isLoggedIn$.subscribe(() => {
      console.log('Detectado cambio de estado de Auth, forzando actualización de App');
      // Forzamos la actualización de la vista cuando hay un login o logout
      this.cdr.detectChanges(); 
    });
    // ----------------------------------

    this.cargarCategorias();
  }
  
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }

  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout(); // El servicio se encargará de todo
    }
  }

  cargarCategorias(): void {
    this.apiService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        if (error.status === 401 && this.authService.isLoggedIn) { // <-- Usamos el getter
          this.apiService.obtenerCategoriasAdmin().subscribe({
            next: (categorias) => { this.categorias = categorias; },
            error: () => { this.categorias = []; }
          });
        } else {
          this.categorias = [];
        }
      }
    });
  }

  buscarProductos(): void {
    const queryParams: any = {};
    if (this.busqueda.trim()) { queryParams.q = this.busqueda.trim(); }
    if (this.categoriaSeleccionada) { queryParams.categoria = this.categoriaSeleccionada; }
    this.router.navigate(['/'], { queryParams });
  }
}