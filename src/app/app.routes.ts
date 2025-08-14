import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { JodiComponent } from './component/jodi/jodi.component';
import { PenalComponent } from './component/penal/penal.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'chart-report', component: JodiComponent },
    { path: 'penal', component: PenalComponent },
    { path: '**', redirectTo: '/home' }
];
