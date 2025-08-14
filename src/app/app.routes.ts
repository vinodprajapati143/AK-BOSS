import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { JodiComponent } from './component/jodi/jodi.component';
import { PenalComponent } from './component/penal/penal.component';

export const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'chart-report', component: JodiComponent },
    { path: 'today-report', component: PenalComponent },
    { path: '**', redirectTo: '/' }
];
