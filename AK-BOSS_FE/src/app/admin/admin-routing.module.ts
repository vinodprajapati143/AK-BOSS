import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { GameAddComponent } from './game-add/game-add.component';
import { AllGameComponent } from './all-game/all-game.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: AdminDashboardComponent },
  { path: 'game-add', component: GameAddComponent },
  { path: 'all-game', component: AllGameComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
