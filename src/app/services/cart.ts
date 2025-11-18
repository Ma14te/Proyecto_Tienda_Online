import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private isBrowser: boolean;
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();
  
  private cartCount = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCount.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.cargarCarrito();
    }
  }

  private cargarCarrito(): void {
    if (!this.isBrowser) return;
    
    const carritoStr = localStorage.getItem('carrito');
    if (carritoStr) {
      try {
        const items = JSON.parse(carritoStr);
        this.cartItems.next(items);
        this.actualizarContador();
      } catch (e) {
        console.error('Error al cargar carrito:', e);
        this.cartItems.next([]);
      }
    }
  }

  private guardarCarrito(): void {
    if (!this.isBrowser) return;
    
    localStorage.setItem('carrito', JSON.stringify(this.cartItems.value));
    this.actualizarContador();
  }

  private actualizarContador(): void {
    const total = this.cartItems.value.reduce((sum, item) => sum + item.cantidad, 0);
    this.cartCount.next(total);
  }

  agregarProducto(producto: any): void {
    const items = this.cartItems.value;
    const existente = items.find(item => item.id_producto === producto.id_producto);

    if (existente) {
      if (existente.cantidad < producto.stock) {
        existente.cantidad++;
      } else {
        alert('No hay suficiente stock disponible');
        return;
      }
    } else {
      const nuevoItem: CartItem = {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0].url_imagen : '',
        stock: producto.stock
      };
      items.push(nuevoItem);
    }

    this.cartItems.next(items);
    this.guardarCarrito();
  }

  actualizarCantidad(id_producto: number, cantidad: number): void {
    const items = this.cartItems.value;
    const item = items.find(i => i.id_producto === id_producto);
    
    if (item) {
      if (cantidad <= 0) {
        this.eliminarProducto(id_producto);
      } else if (cantidad <= item.stock) {
        item.cantidad = cantidad;
        this.cartItems.next(items);
        this.guardarCarrito();
      } else {
        alert('No hay suficiente stock disponible');
      }
    }
  }

  eliminarProducto(id_producto: number): void {
    const items = this.cartItems.value.filter(item => item.id_producto !== id_producto);
    this.cartItems.next(items);
    this.guardarCarrito();
  }

  vaciarCarrito(): void {
    this.cartItems.next([]);
    if (this.isBrowser) {
      localStorage.removeItem('carrito');
    }
    this.actualizarContador();
  }

  obtenerItems(): CartItem[] {
    return this.cartItems.value;
  }

  obtenerTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  obtenerCantidadTotal(): number {
    return this.cartCount.value;
  }
}
