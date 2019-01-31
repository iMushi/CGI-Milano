//Angular Core
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
//Routing
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
//Layouts
import { ConsultaComponent, RootLayout } from './@pages/layouts';
//Layout Service - Required
import { pagesToggleService } from './@pages/services/toggler.service';
//Shared Layout Components
import { HeaderComponent } from './@pages/components/header/header.component';


import { SharedModule } from './@pages/components/shared.module';


import { pgTabsModule } from './@pages/components/tabs/tabs.module';
//Thirdparty Components / Plugins - Optional
import { NvD3Module } from 'ngx-nvd3';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


import { NgxSoapModule } from 'ngx-soap';
import { FlashVentasService } from './services/flash-ventas.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guard/auth.guard';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

//Hammer Config Overide
//https://github.com/angular/angular/issues/10541
export class AppHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pinch': {enable: false},
    'rotate': {enable: false}
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RootLayout,
    ConsultaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    NvD3Module,
    pgTabsModule,
    NgxEchartsModule,
    NgxDnDModule,
    PerfectScrollbarModule,
    NgxSoapModule
  ],
  providers: [CookieService
    , AuthService
    , AuthGuard
    , pagesToggleService
    , FlashVentasService
    , {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: AppHammerConfig
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
