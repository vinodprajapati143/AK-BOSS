import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddGameComponent } from './add-game/add-game.component';
import { AllGameComponent } from './all-game/all-game.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: AdminDashboardComponent },
  { path: 'add-game', component: AddGameComponent },
  { path: 'all-game', component: AllGameComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
