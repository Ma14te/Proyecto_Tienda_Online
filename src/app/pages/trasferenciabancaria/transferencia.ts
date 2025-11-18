import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transferencia',
  imports: [CommonModule, RouterModule],
  templateUrl: './transferencia.html',
  styleUrl: './transferencia.css',
  standalone: true
})
export class TransferenciaBancaria {
  cuentas = [
    {
      banco: 'Banco Pichincha',
      logo: '/Trasferencias Bancarias/Banco_pichincha_Logo.svg',
      tipoCuenta: 'Cuenta Corriente',
      numero: '2100123456',
      titular: 'Ekuamarket S.A.',
      ruc: '1792345678001',
      email: 'pagos@ekuamarket.com'
    },
    {
      banco: 'Banco Guayaquil',
      logo: '/Trasferencias Bancarias/Banco_Guayaquil_Logo.svg',
      tipoCuenta: 'Cuenta de Ahorros',
      numero: '0012345678',
      titular: 'Ekuamarket S.A.',
      ruc: '1792345678001',
      email: 'pagos@ekuamarket.com'
    },
    {
      banco: 'Jardín Azuayo',
      logo: '/Trasferencias Bancarias/Jardin Pagos_Logo.svg',
      tipoCuenta: 'Cuenta de Ahorros',
      numero: '3300567890',
      titular: 'Ekuamarket S.A.',
      ruc: '1792345678001',
      email: 'pagos@ekuamarket.com'
    }
  ];
}
