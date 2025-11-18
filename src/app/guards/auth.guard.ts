import { inject, PLATFORM_ID } from '@angular/core'; // <-- Importa PLATFORM_ID
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { isPlatformBrowser } from '@angular/common'; // <-- Importa isPlatformBrowser

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); // <-- Inyecta PLATFORM_ID

  // Si no estamos en el navegador, permitir el paso.
  if (!isPlatformBrowser(platformId)) {
    return true; // <-- ESTA ES LA CORRECCIÓN
  }

  // Solo revisa si está logueado (en el navegador)
  if (authService.estaLogueado()) {
    return true;
  }

  // Si no, redirige al login
  router.navigate(['/login']);
  return false;
};