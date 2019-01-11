import { Routes } from '@angular/router';
//Layouts
import { BlankCasualComponent, CasualLayout, ConsultaComponent } from './@pages/layouts';
//Sample Pages
import { CasualDashboardComponent } from './dashboard/casual/dashboard.component';
import { CardsComponentPage } from './cards/cards.component';
import { ViewsPageComponent } from './views/views.component';
import { ChartsComponent } from './charts/charts.component';
import { SocialComponent } from './social/social.component';

export const AppRoutes: Routes = [
    {
        path: 'consulta',
        component: ConsultaComponent,
        loadChildren: './consulta/consulta.module#ConsultaModule'
    },
    //Casual
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'dashboard',
            component: CasualDashboardComponent
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'social',
            component: SocialComponent
        }]
    }, {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'builder',
            loadChildren: './builder/builder.module#BuilderModule'
        }]
    }, {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'layouts',
            loadChildren: './layouts/layouts.module#LayoutPageModule'
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'extra',
            loadChildren: './extra/extra.module#ExtraModule'
        }]
    }, {
        path: 'casual',
        component: BlankCasualComponent,
        children: [{
            path: 'session',
            loadChildren: './session/session.module#SessionModule'
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'forms',
            loadChildren: './forms/forms.module#FormsPageModule'
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'ui',
            loadChildren: './ui/ui.module#UiModule'
        }]
    }, {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'email',
            loadChildren: './email/email.module#EmailModule'
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'cards',
            component: CardsComponentPage
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'views',
            component: ViewsPageComponent
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'tables',
            loadChildren: './tables/tables.module#TablesModule'
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'maps',
            loadChildren: './maps/maps.module#MapsModule'
        }]
    },
    {
        path: 'casual',
        component: CasualLayout,
        children: [{
            path: 'charts',
            component: ChartsComponent
        }]
    }
];
