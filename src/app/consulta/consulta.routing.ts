import { Routes } from '@angular/router';
import { FlashVentasComponent } from './flash-ventas/flash-ventas.component';

export const ConsultaRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'flash-ventas',
      component: FlashVentasComponent
    }]
  }
];
