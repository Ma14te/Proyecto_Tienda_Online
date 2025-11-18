import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
  standalone: true
})
export class Carrito implements OnInit {
  items: CartItem[] = [];
  totalPrecio: number = 0;
  totalItems: number = 0;
  procesando: boolean = false;
  private isBrowser: boolean;

  constructor(
    private cartService: CartService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.items = items;
      this.calcularTotales();
    });
  }

  calcularTotales(): void {
    this.totalPrecio = this.cartService.obtenerTotal();
    this.totalItems = this.cartService.obtenerCantidadTotal();
  }

  incrementarCantidad(item: CartItem): void {
    this.cartService.actualizarCantidad(item.id_producto, item.cantidad + 1);
  }

  decrementarCantidad(item: CartItem): void {
    if (item.cantidad > 1) {
      this.cartService.actualizarCantidad(item.id_producto, item.cantidad - 1);
    }
  }

  actualizarCantidad(item: CartItem, event: any): void {
    const cantidad = parseInt(event.target.value);
    if (cantidad > 0) {
      this.cartService.actualizarCantidad(item.id_producto, cantidad);
    }
  }

  eliminarItem(item: CartItem): void {
    if (confirm(`¿Eliminar ${item.nombre} del carrito?`)) {
      this.cartService.eliminarProducto(item.id_producto);
      this.mostrarToast('Producto eliminado del carrito', 'success');
    }
  }

  vaciarCarrito(): void {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.cartService.vaciarCarrito();
      this.mostrarToast('Carrito vaciado', 'success');
    }
  }

  realizarCompra(): void {
    if (!this.authService.estaLogueado()) {
      this.mostrarToast('Debes iniciar sesión para realizar una compra', 'error');
      this.router.navigate(['/login']);
      return;
    }

    if (this.items.length === 0) {
      this.mostrarToast('El carrito está vacío', 'error');
      return;
    }

    this.procesando = true;

    const pedido = {
      total: this.totalPrecio,
      items: this.items.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      }))
    };

    this.apiService.crearPedido(pedido).subscribe({
      next: (response) => {
        this.mostrarToast('¡Compra realizada exitosamente!', 'success');
        this.cartService.vaciarCarrito();
        this.procesando = false;
        
        // Redirigir a mis pedidos después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/mis-pedidos']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al crear pedido:', error);
        this.mostrarToast('Error al procesar la compra. Intenta de nuevo.', 'error');
        this.procesando = false;
      }
    });
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
