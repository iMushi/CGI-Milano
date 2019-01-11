import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashVentasComponent } from './flash-ventas/flash-ventas.component';
import { SharedModule } from '../@pages/components/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConsultaRoutes } from './consulta.routing';
import { pgSelectModule } from '../@pages/components/select/select.module';
import { pgDatePickerModule } from '../@pages/components/datepicker/datepicker.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ConsultaRoutes),
    FormsModule,
    ReactiveFormsModule,
    pgSelectModule,
    pgDatePickerModule
  ],
  declarations: [FlashVentasComponent]
})
export class ConsultaModule {
}
