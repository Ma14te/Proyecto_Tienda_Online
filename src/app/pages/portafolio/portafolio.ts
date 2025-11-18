import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-portafolio',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portafolio.html',
  styleUrl: './portafolio.css',
  standalone: true
})
export class Portafolio {
  formData = {
    nombre: '',
    email: '',
    telefono: '',
    titulo: '',
    genero: '',
    descripcion: '',
    paginas: '',
    tieneManuscrito: 'si'
  };

  enviarFormulario() {
    console.log('Datos del formulario:', this.formData);
    alert('Gracias por tu interés. Te contactaremos pronto.');
  }
}
