import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  standalone: true
})
export class Admin implements OnInit {
  tabActiva: string = 'estadisticas';
  productos: any[] = [];
  categorias: any[] = [];
  pedidos: any[] = []; // <-- NUEVO
  
  // Lista de estados posibles (basado en PedidoController.js)
  estadosPedido: string[] = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']; // <-- NUEVO

  mostrarFormProducto: boolean = false;
  mostrarFormCategoria: boolean = false;
  
  productoForm: any = {
    id_producto: null,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    id_categoria: '',
    imagen_url: '',
    imagenes: []
  };

  categoriaForm: any = {
    id_categoria: null,
    nombre: '',
    descripcion: ''
  };

  estadisticas = {
    totalProductos: 0,
    totalCategorias: 0,
    stockTotal: 0,
    valorInventario: 0
  };

  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    console.log('Admin ngOnInit ejecutado');
    
    if (!this.isBrowser) {
      console.log('Ejecutando en servidor, saltando inicialización');
      return;
    }

    console.log('Verificando autenticación...');
    console.log('Está logueado:', this.authService.estaLogueado());
    console.log('Es admin:', this.authService.esAdmin());
    console.log('Token:', localStorage.getItem('token'));
    console.log('Es admin (localStorage):', localStorage.getItem('es_admin'));

    if (!this.authService.estaLogueado() || !this.authService.esAdmin()) {
      this.mostrarToast('Acceso denegado. Redirigiendo...', 'error');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    if (!this.isBrowser) {
      console.log('No se puede cargar datos en SSR');
      return;
    }

    console.log('Cargando datos del admin...');
    
    // Verificar que tenemos token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token disponible');
      this.mostrarToast('Sesión expirada. Redirigiendo al login...', 'error');
      setTimeout(() => this.router.navigate(['/login']), 1500);
      return;
    }

    // Cargar Productos con autenticación
    this.apiService.obtenerProductos().subscribe({
      next: (productos) => {
        console.log('✅ Productos cargados:', productos);
        console.log('✅ Cantidad de productos:', productos.length);
        console.log('✅ Primer producto:', productos[0]);
        this.productos = productos;
        this.calcularEstadisticas();
      },
      error: (error) => {
        console.error('❌ Error al cargar productos:', error);
        if (error.status === 401 || error.status === 403) {
          this.mostrarToast('Sesión expirada. Redirigiendo...', 'error');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.mostrarToast('Error al cargar productos', 'error');
        }
      }
    });

    // Cargar Categorías con autenticación
    this.apiService.obtenerCategoriasAdmin().subscribe({
      next: (categorias) => {
        console.log('Categorías cargadas:', categorias);
        this.categorias = categorias;
        this.calcularEstadisticas();
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        if (error.status === 401 || error.status === 403) {
          this.mostrarToast('Sesión expirada. Redirigiendo...', 'error');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.mostrarToast('Error al cargar categorías', 'error');
        }
      }
    });

    // Cargar Pedidos
    this.apiService.obtenerTodosPedidos().subscribe({
      next: (pedidos) => {
        console.log('Pedidos cargados:', pedidos);
        this.pedidos = pedidos;
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        if (error.status === 401 || error.status === 403) {
          this.mostrarToast('Sesión expirada. Redirigiendo...', 'error');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.mostrarToast('Error al cargar pedidos', 'error');
        }
      }
    });
  }

  calcularEstadisticas(): void {
    this.estadisticas.totalProductos = this.productos.length;
    this.estadisticas.totalCategorias = this.categorias.length;
    this.estadisticas.stockTotal = this.productos.reduce((sum, p) => sum + (p.stock || 0), 0);
    this.estadisticas.valorInventario = this.productos.reduce((sum, p) => sum + (p.precio * p.stock || 0), 0);
  }

  cambiarTab(tab: string, event: Event): void {
    event.preventDefault();
    this.tabActiva = tab;
  }

  // --- Productos ---
  // ( ... tus funciones nuevoProducto, editarProducto, guardarProducto, eliminarProducto, cancelarProducto ... )
  // --- Categorías ---
  // ( ... tus funciones nuevaCategoria, editarCategoria, guardarCategoria, eliminarCategoria, cancelarCategoria ... )

  // --- NUEVA SECCIÓN: PEDIDOS ---
  actualizarEstadoPedido(pedido: any, event: any): void {
    const nuevoEstado = event.target.value;
    if (!nuevoEstado) return;

    this.apiService.actualizarEstadoPedido(pedido.id_pedido, nuevoEstado).subscribe({
      next: () => {
        this.mostrarToast(`Pedido #${pedido.id_pedido} actualizado a "${nuevoEstado}"`, 'success');
        // Actualizar el estado localmente para que se vea reflejado
        const pedidoEncontrado = this.pedidos.find(p => p.id_pedido === pedido.id_pedido);
        if (pedidoEncontrado) {
          pedidoEncontrado.estado = nuevoEstado;
        }
      },
      error: (error) => {
        console.error('Error al actualizar estado del pedido:', error);
        this.mostrarToast('Error al actualizar estado', 'error');
        // Recargar datos por si acaso
        this.cargarDatos();
      }
    });
  }


  // --- Utilidades ---
  obtenerNombreCategoria(id: number): string {
    const categoria = this.categorias.find(c => c.id_categoria == id);
    return categoria ? categoria.nombre : 'Sin categoría';
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

  // ... (Pega aquí el resto de tus funciones de productos y categorías que omití por brevedad) ...
  // --- Productos ---
  nuevoProducto(): void {
    this.productoForm = {
      id_producto: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      id_categoria: '',
      imagen_url: '',
      imagenes: []
    };
    this.mostrarFormProducto = true;
  }

  editarProducto(producto: any): void {
    this.productoForm = {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      id_categoria: producto.id_categoria,
      imagen_url: this.obtenerImagenPrincipal(producto),
      imagenes: producto.imagenes || []
    };
    this.mostrarFormProducto = true;
  }

  guardarProducto(event: Event): void {
    event.preventDefault();

    const producto = {
      nombre: this.productoForm.nombre,
      descripcion: this.productoForm.descripcion,
      precio: parseFloat(this.productoForm.precio),
      stock: parseInt(this.productoForm.stock),
      id_categoria: parseInt(this.productoForm.id_categoria)
    };

    if (this.productoForm.id_producto) {
      // Actualizar
      this.apiService.actualizarProducto(this.productoForm.id_producto, producto).subscribe({
        next: (productoActualizado) => {
          // Si hay una nueva imagen URL, agregarla o actualizar la imagen principal
          if (this.productoForm.imagen_url && this.productoForm.imagen_url.trim() !== '') {
            this.guardarImagen(this.productoForm.id_producto, this.productoForm.imagen_url);
          } else {
            this.mostrarToast('Producto actualizado exitosamente', 'success');
            this.cargarDatos();
            this.cancelarProducto();
          }
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
          this.mostrarToast('Error al actualizar producto', 'error');
        }
      });
    } else {
      // Crear
      this.apiService.crearProducto(producto).subscribe({
        next: (productoCreado) => {
          // Si hay una imagen URL, agregarla al producto recién creado
          if (this.productoForm.imagen_url && this.productoForm.imagen_url.trim() !== '') {
            const idProducto = productoCreado.id_producto || productoCreado.id;
            this.guardarImagen(idProducto, this.productoForm.imagen_url);
          } else {
            this.mostrarToast('Producto creado exitosamente', 'success');
            this.cargarDatos();
            this.cancelarProducto();
          }
        },
        error: (error) => {
          console.error('Error al crear producto:', error);
          this.mostrarToast('Error al crear producto', 'error');
        }
      });
    }
  }

  guardarImagen(idProducto: number, urlImagen: string): void {
    const imagen = {
      id_producto: idProducto,
      url_imagen: urlImagen,
      es_principal: true
    };

    this.apiService.crearImagen(imagen).subscribe({
      next: () => {
        this.mostrarToast('Producto e imagen guardados exitosamente', 'success');
        this.cargarDatos();
        this.cancelarProducto();
      },
      error: (error) => {
        console.error('Error al guardar imagen:', error);
        this.mostrarToast('Producto guardado pero error al agregar imagen', 'warning');
        this.cargarDatos();
        this.cancelarProducto();
      }
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.apiService.eliminarProducto(id).subscribe({
        next: () => {
          this.mostrarToast('Producto eliminado exitosamente', 'success');
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.mostrarToast('Error al eliminar producto', 'error');
        }
      });
    }
  }

  cancelarProducto(): void {
    this.mostrarFormProducto = false;
    this.productoForm = {
      id_producto: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      id_categoria: '',
      imagen_url: '',
      imagenes: []
    };
  }

  // --- Categorías ---
  nuevaCategoria(): void {
    this.categoriaForm = {
      id_categoria: null,
      nombre: '',
      descripcion: ''
    };
    this.mostrarFormCategoria = true;
  }

  editarCategoria(categoria: any): void {
    this.categoriaForm = {
      id_categoria: categoria.id_categoria,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion
    };
    this.mostrarFormCategoria = true;
  }

  guardarCategoria(event: Event): void {
    event.preventDefault();

    const categoria = {
      nombre: this.categoriaForm.nombre,
      descripcion: this.categoriaForm.descripcion
    };

    if (this.categoriaForm.id_categoria) {
      // Actualizar
      this.apiService.actualizarCategoria(this.categoriaForm.id_categoria, categoria).subscribe({
        next: () => {
          this.mostrarToast('Categoría actualizada exitosamente', 'success');
          this.cargarDatos();
          this.cancelarCategoria();
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          this.mostrarToast('Error al actualizar categoría', 'error');
        }
      });
    } else {
      // Crear
      this.apiService.crearCategoria(categoria).subscribe({
        next: () => {
          this.mostrarToast('Categoría creada exitosamente', 'success');
          this.cargarDatos();
          this.cancelarCategoria();
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.mostrarToast('Error al crear categoría', 'error');
        }
      });
    }
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.apiService.eliminarCategoria(id).subscribe({
        next: () => {
          this.mostrarToast('Categoría eliminada exitosamente', 'success');
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          this.mostrarToast('Error al eliminar categoría', 'error');
        }
      });
    }
  }

  cancelarCategoria(): void {
    this.mostrarFormCategoria = false;
    this.categoriaForm = {
      id_categoria: null,
      nombre: '',
      descripcion: ''
    };
  }

  contarProductosPorCategoria(idCategoria: number): number {
    return this.productos.filter(p => p.id_categoria === idCategoria).length;
  }

  // ==========================================================
  // INICIO DE LA FUNCIÓN AÑADIDA
  // ==========================================================
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
  // ==========================================================
  // FIN DE LA FUNCIÓN AÑADIDA
  // ==========================================================
}