import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register {
  nombre: string = '';
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

    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: (respuesta) => {
        if (respuesta) {
          this.mostrarToast('Registro exitoso. Redirigiendo al login...', 'success');
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        }
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.mostrarToast(error.message || 'Error al registrarse', 'error');
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
