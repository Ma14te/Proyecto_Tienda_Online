/*
* CÓDIGO COMPLETO Y MODIFICADO: src/app/services/auth.ts
*/

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './api';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // --- NUEVA LÓGICA ---
  // Propiedades públicas que almacenan el estado actual
  public isLoggedIn: boolean = false;
  public isAdmin: boolean = false;
  public nombreUsuario: string = 'Usuario';

  // BehaviorSubject para notificar *cambios* (login/logout)
  private loggedInStatus = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedInStatus.asObservable();
  // --------------------

  private isBrowser: boolean;

  constructor(
    private api: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // --- NUEVA LÓGICA ---
    // Si estamos en el navegador, cargamos el estado desde localStorage INMEDIATAMENTE.
    if (this.isBrowser) {
      this.loadStateFromLocalStorage();
    }
    // --------------------
  }
  
  // --- NUEVA FUNCIÓN ---
  private loadStateFromLocalStorage(): void {
    if (!this.isBrowser) return;

    const token = this.obtenerToken();
    if (token) {
      this.isLoggedIn = true;
      // Llama a la función que ya teníamos para leer localStorage
      this.isAdmin = this.leerEsAdminDesdeStorage(); 
      
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          this.nombreUsuario = userData.nombre || 'Usuario';
        } catch (e) { this.nombreUsuario = 'Usuario'; }
      }
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.nombreUsuario = 'Usuario';
    }
    
    // Notificamos a los suscriptores el estado inicial
    this.loggedInStatus.next(this.isLoggedIn);
    console.log('✅ AuthService inicializado:', { isLoggedIn: this.isLoggedIn, isAdmin: this.isAdmin, nombre: this.nombreUsuario });
  }
  // --------------------

  private guardarSesion(token: string, esAdmin: boolean, userData?: any): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
      localStorage.setItem('es_admin', String(esAdmin));
      
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        this.nombreUsuario = userData.nombre || 'Usuario'; // Actualiza la propiedad pública
      }
      
      // Actualiza propiedades públicas
      this.isLoggedIn = true;
      this.isAdmin = esAdmin;
      
      // Notifica a los suscriptores que hubo un cambio (login)
      this.loggedInStatus.next(true);
    }
  }

  obtenerToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // estaLogueado() ahora solo es un alias para la propiedad pública
  estaLogueado(): boolean {
    return this.isLoggedIn;
  }

  // esAdmin() ahora es un alias para la propiedad pública
  esAdmin(): boolean {
    return this.isAdmin;
  }

  // Función interna para leer el storage de forma segura
  private leerEsAdminDesdeStorage(): boolean {
    if (this.isBrowser) {
      const esAdminValue = localStorage.getItem('es_admin');
      console.log('🔍 Verificando esAdmin:', esAdminValue, '| Resultado:', esAdminValue === 'true');
      return esAdminValue === 'true';
    }
    return false;
  }

  login(email: string, password: string): Observable<any> {
    return this.api.login(email, password).pipe(
      tap((respuesta: any) => {
        if (respuesta && respuesta.token) {
          const userData = {
            // Asumiendo que el backend envía 'nombre'
            // (basado en mi respuesta anterior)
            nombre: respuesta.nombre || 'Usuario', 
            email: email
          };
          this.guardarSesion(respuesta.token, respuesta.es_admin, userData);
        }
      })
    );
  }

  register(nombre: string, email: string, password: string): Observable<any> {
    return this.api.register(nombre, email, password);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('es_admin');
      localStorage.removeItem('userData');
      
      // Resetea las propiedades públicas
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.nombreUsuario = 'Usuario';
      
      // Notifica a los suscriptores que hubo un cambio (logout)
      this.loggedInStatus.next(false);
    }
    this.router.navigate(['/']);
  }
}