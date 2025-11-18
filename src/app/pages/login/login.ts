import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  email: string = '';
  password: string = '';
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.authService.login(this.email, this.password).subscribe({
      next: (respuesta) => {
        console.log('🔐 Respuesta del login:', respuesta);
        console.log('🔐 es_admin recibido:', respuesta.es_admin);
        console.log('🔐 Tipo de es_admin:', typeof respuesta.es_admin);
        
        if (respuesta && respuesta.token) {
          this.mostrarToast('Inicio de sesión exitoso', 'success');
          
          // Verificar inmediatamente después de guardar
          setTimeout(() => {
            console.log('🔐 es_admin en localStorage:', localStorage.getItem('es_admin'));
            
            if (respuesta.es_admin) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }, 1000);
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.mostrarToast(error.message || 'Error al iniciar sesión', 'error');
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
