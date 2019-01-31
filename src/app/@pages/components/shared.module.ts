import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObserversModule } from '@angular/cdk/observers';


import { ParallaxDirective } from './parallax/parallax.directive';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormGroupDefaultDirective } from './forms/form-group-default.directive';

import { pgCollapseModule } from './collapse/collapse.module';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ContainerComponent } from './container/container.component';
import { pageContainer } from './container/page-container.component';
import { RouterModule } from '@angular/router';
import { pgRetinaDirective } from './retina/retina.directive';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    ObserversModule,
    PerfectScrollbarModule,
    RouterModule
  ],
  declarations: [
    ParallaxDirective,
    BreadcrumbComponent,
    FormGroupDefaultDirective,
    ContainerComponent,
    pageContainer,
    pgRetinaDirective
  ],
  exports: [
    ParallaxDirective,
    BreadcrumbComponent,
    FormGroupDefaultDirective,
    pgCollapseModule,
    ContainerComponent,
    pageContainer,
    pgRetinaDirective
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }
  ]

})
export class SharedModule {
}
