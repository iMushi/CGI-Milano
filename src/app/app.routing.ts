import { Routes } from '@angular/router';
//Layouts
import { ConsultaComponent } from './@pages/layouts';

export const AppRoutes: Routes = [
  {
    path: 'consulta',
    component: ConsultaComponent,
    loadChildren: './consulta/consulta.module#ConsultaModule'
  }
];
