import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // ✅ LA URL CORRECTA (Sin el puerto 8080, Railway lo hace automático)
  private API_URL = 'https://tiendaonlinebankend-production.up.railway.app/api';
  
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.isBrowser ? localStorage.getItem('token') : null;
    
    if (!token) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // --- Usuarios ---
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/usuarios/login`, { email, password });
  }

  register(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/usuarios/register`, { nombre, email, password });
  }

  // --- Productos ---
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/productos`, { headers: this.getAuthHeaders() }).pipe(
      map(data => Array.isArray(data) ? data : [])
    );
  }

  obtenerProductoPorId(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/productos/${id}`).pipe(
      map((p: any) => p && typeof p === 'object' ? {
        id: p.id_producto,
        id_categoria: p.id_categoria,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        stock: p.stock,
        fecha_creacion: p.fecha_creacion,
        imagenes: p.imagenes || []
      } : null)
    );
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post(`${this.API_URL}/productos`, producto, { headers: this.getAuthHeaders() });
  }

  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.API_URL}/productos/${id}`, producto, { headers: this.getAuthHeaders() });
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/productos/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Categorías ---
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/categorias`);
  }

  obtenerCategoriasAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/categorias`, { headers: this.getAuthHeaders() });
  }

  crearCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.API_URL}/categorias`, categoria, { headers: this.getAuthHeaders() });
  }

  actualizarCategoria(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.API_URL}/categorias/${id}`, categoria, { headers: this.getAuthHeaders() });
  }

  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/categorias/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Pedidos ---
  crearPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.API_URL}/pedidos`, pedido, { headers: this.getAuthHeaders() });
  }

  obtenerMisPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pedidos`, { headers: this.getAuthHeaders() });
  }

  obtenerTodosPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pedidos/todos`, { headers: this.getAuthHeaders() });
  }

  actualizarEstadoPedido(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.API_URL}/pedidos/${id}/estado`, { estado }, { headers: this.getAuthHeaders() });
  }

  // --- Imágenes ---
  obtenerImagenesPorProducto(id_producto: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/imagenes/producto/${id_producto}`);
  }

  crearImagen(imagen: any): Observable<any> {
    return this.http.post(`${this.API_URL}/imagenes`, imagen, { headers: this.getAuthHeaders() });
  }

  actualizarImagen(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.API_URL}/imagenes/${id}`, datos, { headers: this.getAuthHeaders() });
  }

  eliminarImagen(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/imagenes/${id}`, { headers: this.getAuthHeaders() });
  }

  marcarImagenPrincipal(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/imagenes/${id}`, { es_principal: true }, { headers: this.getAuthHeaders() });
  }
}