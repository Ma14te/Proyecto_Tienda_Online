import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categorias: any[] = [];
  categoriaSeleccionada: string = '';
  busqueda: string = '';
  estaLogueado: boolean = false;
  esAdmin: boolean = false;
  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.estaLogueado = this.authService.estaLogueado();
    this.esAdmin = this.authService.esAdmin();
    this.cargarDatos();

    // Escuchar cambios en los parámetros de búsqueda
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.busqueda = params['q'];
      }
      if (params['categoria']) {
        this.categoriaSeleccionada = params['categoria'];
      }
      // Aplicar filtros si hay productos cargados
      if (this.productos.length > 0) {
        this.filtrarProductos();
      }
    });
  }

  cargarDatos(): void {
    this.apiService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = productos;
        // Aplicar filtros si hay parámetros de búsqueda
        this.filtrarProductos();
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.mostrarToast('Error al cargar productos', 'error');
      }
    });

    this.apiService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        // Si el error es 401, intentar con credenciales si está logueado
        if (error.status === 401 && this.authService.estaLogueado()) {
          this.apiService.obtenerCategoriasAdmin().subscribe({
            next: (categorias) => {
              this.categorias = categorias;
            },
            error: (err) => {
              console.error('Error al cargar categorías con auth:', err);
              // Continuar sin categorías en lugar de mostrar error al usuario
              this.categorias = [];
            }
          });
        } else {
          // Continuar sin categorías en lugar de bloquear la app
          this.categorias = [];
        }
      }
    });
  }

  filtrarProductos(): void {
    let filtrados = [...this.productos];

    // Filtrar por categoría
    if (this.categoriaSeleccionada) {
      filtrados = filtrados.filter(p => p.id_categoria == this.categoriaSeleccionada);
    }

    // Filtrar por búsqueda
    if (this.busqueda.trim()) {
      const termino = this.busqueda.toLowerCase();
      filtrados = filtrados.filter(p => 
        p.nombre.toLowerCase().includes(termino) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(termino))
      );
    }

    this.productosFiltrados = filtrados;
  }

  obtenerImagenPrincipal(producto: any): string {
    if (producto.imagenes && producto.imagenes.length > 0) {
      const principal = producto.imagenes.find((img: any) => img.es_principal);
      const url = principal ? principal.url_imagen : producto.imagenes[0].url_imagen;
      // Validar que la URL sea válida
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        return url;
      }
    }
    // Usar un placeholder válido
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18"%3ESin Imagen%3C/text%3E%3C/svg%3E';
  }

  getPrecioDecimal(precio: number): string {
    const decimal = (precio % 1).toFixed(2).substring(1);
    return decimal;
  }

  agregarAlCarrito(producto: any): void {
    if (producto.stock === 0) {
      this.mostrarToast('Producto agotado', 'error');
      return;
    }
    
    this.cartService.agregarProducto(producto);
    this.mostrarToast(`${producto.nombre} agregado al carrito`, 'success');
  }

  logout(): void {
    this.authService.logout();
  }

  private mostrarToast(mensaje: string, tipo: string): void {
    if (!this.isBrowser) return;
    
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
