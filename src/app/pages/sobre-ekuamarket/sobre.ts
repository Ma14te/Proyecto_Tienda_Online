import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sobre-ekuamarket',
  imports: [CommonModule, RouterModule],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css',
  standalone: true
})
export class SobreEkuamarket {
  habilidades = [
    { nombre: 'Angular', nivel: 90 },
    { nombre: 'TypeScript', nivel: 85 },
    { nombre: 'Node.js', nivel: 80 },
    { nombre: 'Python', nivel: 75 },
    { nombre: 'SQL/PostgreSQL', nivel: 85 },
    { nombre: 'HTML/CSS', nivel: 95 },
    { nombre: 'Git/GitHub', nivel: 80 },
    { nombre: 'AWS/Cloud', nivel: 70 }
  ];

  proyectos = [
    {
      nombre: 'Ekuamarket',
      descripcion: 'Plataforma de comercio electrónico completa con interfaz moderna, gestión de productos, carrito de compras, procesamiento de pagos, sistema de autenticación y panel administrativo',
      tecnologias: ['Angular 19', 'Node.js', 'MySQL', 'TypeScript', 'Express', 'JWT'],
      imagen: '/Foto compoaratiba con varios empleados.png'
    }
  ];

  experiencia = [
    {
      puesto: 'Full Stack Developer',
      empresa: 'Ekuamarket',
      periodo: '2024 - Presente',
      descripcion: 'Desarrollo de plataforma de comercio electrónico completa con Angular y Node.js'
    },
    {
      puesto: 'Frontend Developer',
      empresa: 'Proyectos Personales',
      periodo: '2023 - 2024',
      descripcion: 'Desarrollo de interfaces web modernas y responsivas'
    }
  ];

  educacion = [
    {
      titulo: 'Ingeniería en Sistemas',
      institucion: 'Universidad de Ecuador',
      periodo: '2020 - Presente',
      descripcion: 'Especialización en desarrollo web y bases de datos'
    }
  ];
}
