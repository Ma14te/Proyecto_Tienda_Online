import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    // Si no estamos en el navegador (estamos en el servidor),
    // permitir siempre el paso. El guard se volverá a ejecutar
    // en el cliente durante la hidratación.
    if (!isPlatformBrowser(this.platformId)) {
      return true; // <-- ESTA ES LA CORRECCIÓN
    }

    // El resto del código solo se ejecuta en el navegador
    const token = localStorage.getItem('token');
    const esAdmin = localStorage.getItem('es_admin') === 'true';

    if (!token || !esAdmin) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    return true;
  }
}