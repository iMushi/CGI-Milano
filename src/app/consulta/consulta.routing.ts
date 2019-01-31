import { Routes } from '@angular/router';
import { FlashVentasComponent } from './flash-ventas/flash-ventas.component';
import { ConsultaDrillDownComponent } from './consulta-drill-down/consulta-drill-down.component';
import { AuthGuard } from '../guard/auth.guard';

export const ConsultaRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'flash-ventas',
      canActivate: [AuthGuard],
      component: FlashVentasComponent,
      data: {
        title: 'Flash Ventas'
      }
    }, {
      path: 'consulta-drill-down',
      component: ConsultaDrillDownComponent,
      canActivate: [AuthGuard],
      data: {
        title: 'Drill Down'
      }
    }]
  }
];
