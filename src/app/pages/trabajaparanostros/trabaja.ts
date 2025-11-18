import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trabaja',
  imports: [CommonModule, RouterModule],
  templateUrl: './trabaja.html',
  styleUrl: './trabaja.css',
  standalone: true
})
export class TrabajaParaNosotros {
  posiciones = [
    {
      titulo: 'Desarrollador Full Stack',
      departamento: 'Tecnología',
      ubicacion: 'Quito, Ecuador',
      tipo: 'Tiempo completo',
      descripcion: 'Buscamos desarrolladores apasionados para unirse a nuestro equipo de innovación tecnológica.'
    },
    {
      titulo: 'Ingeniero en Computación Cuántica',
      departamento: 'Investigación y Desarrollo',
      ubicacion: 'Quito, Ecuador',
      tipo: 'Tiempo completo',
      descripcion: 'Únete a nuestro equipo pionero en computación cuántica y ayuda a construir el futuro.'
    },
    {
      titulo: 'Especialista en Logística',
      departamento: 'Operaciones',
      ubicacion: 'Guayaquil, Ecuador',
      tipo: 'Tiempo completo',
      descripcion: 'Optimiza nuestras operaciones de entrega y gestión de inventario en todo el país.'
    },
    {
      titulo: 'Diseñador UX/UI',
      departamento: 'Diseño',
      ubicacion: 'Remoto',
      tipo: 'Tiempo completo',
      descripcion: 'Crea experiencias excepcionales para nuestros usuarios en todas nuestras plataformas.'
    },
    {
      titulo: 'Gerente de Marketing Digital',
      departamento: 'Marketing',
      ubicacion: 'Quito, Ecuador',
      tipo: 'Tiempo completo',
      descripcion: 'Lidera nuestras estrategias de marketing digital y expande nuestra presencia en línea.'
    },
    {
      titulo: 'Servicio al Cliente',
      departamento: 'Atención al Cliente',
      ubicacion: 'Cuenca, Ecuador',
      tipo: 'Medio tiempo',
      descripcion: 'Ayuda a nuestros clientes a tener la mejor experiencia de compra posible.'
    }
  ];
}
