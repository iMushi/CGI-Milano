import { Routes } from '@angular/router';
import { FlashVentasComponent } from './flash-ventas/flash-ventas.component';
import { ConsultaDrillDownComponent } from './consulta-drill-down/consulta-drill-down.component';

export const ConsultaRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'flash-ventas',
      component: FlashVentasComponent,
      data: {
        title: 'Flash Ventas'
      }
    }, {
      path: 'consulta-drill-down',
      component: ConsultaDrillDownComponent,
      data: {
        title: 'Drill Down'
      }
    }]
  }
];
