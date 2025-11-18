import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Admin } from './pages/admin/admin';
import { AdminGuard } from './guards/admin-guard';
import { MyOrders } from './pages/my-orders/my-orders';
import { authGuard } from './guards/auth.guard';
import { MetodosPago } from './pages/metodos_de_pago/metodos-pago';
import { TrabajaParaNosotros } from './pages/trabajaparanostros/trabaja';
import { Portafolio } from './pages/portafolio/portafolio';
import { TransferenciaBancaria } from './pages/trasferenciabancaria/transferencia';
import { EkuamarketScience } from './pages/Ekuamark Science/science';
import { SobreEkuamarket } from './pages/sobre-ekuamarket/sobre';
import { Carrito } from './pages/carrito/carrito';
import { Privacidad } from './pages/Privacidad/privacidad';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'admin', component: Admin, canActivate: [AdminGuard] },
  { path: 'mis-pedidos', component: MyOrders, canActivate: [authGuard] },
  { path: 'my-orders', component: MyOrders, canActivate: [authGuard] },
  { path: 'carrito', component: Carrito },
  { path: 'metodos_de_pago', component: MetodosPago },
  { path: 'trabajaparanostros', component: TrabajaParaNosotros },
  { path: 'portafolio', component: Portafolio },
  { path: 'trasferenciabancaria', component: TransferenciaBancaria },
  { path: 'ekuamarket-science', component: EkuamarketScience },
  { path: 'sobre-ekuamarket', component: SobreEkuamarket },
  { path: 'privacidad', component: Privacidad },
  { path: '**', redirectTo: '' }
];