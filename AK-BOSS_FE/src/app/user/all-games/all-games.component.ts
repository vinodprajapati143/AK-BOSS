import { Component, inject } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NgFor, Location, CommonModule } from '@angular/common';
import { AdminRoutingModule } from "../../admin/admin-routing.module";
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { GamedataService } from '../../core/services/gamedata.service';
import { PlayGameComponent } from '../play-game/play-game.component';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, NgFor, AdminRoutingModule, PlayGameComponent, NgFor, CommonModule],
  templateUrl: './all-games.component.html',
  styleUrl: './all-games.component.scss'
})
export class AllGamesComponent {
  router = inject(Router);
  gameDataService = inject(GamedataService);
  location = inject(Location);
  selectedGame: any = null;


menuItems = [
  { title: 'Single Ank', icon: 'assets/images/dice.png', active: false, entryType: 'singleank' },
  { title: 'Jodi', icon: 'assets/images/dice.png', active: false, entryType: 'jodi' },
  { title: 'Single Panna', icon: 'assets/images/dice.png', active: false, entryType: 'singlepanna' },
  { title: 'Double Panna', icon: 'assets/images/dice.png', active: false, entryType: 'doublepanna' },
  { title: 'Triple Panna', icon: 'assets/images/dice.png', active: false, entryType: 'triplepanna' },
  { title: 'Half Sangam', icon: 'assets/images/dice.png', active: false, entryType: 'halfsangama' },
  { title: 'Full Sangam', icon: 'assets/images/dice.png', active: false, entryType: 'fullsangam' },
];

 

onGameClick(item: any) {
  // update service with the selected entry type
  this.gameDataService.updateEntryType(item.entryType);

  // navigate to same play route
  this.router.navigate(['/user/play']);

  // update active state
  this.menuItems.forEach(i => i.active = false);
  item.active = true;
  this.selectedGame = item;
}

  back() {
    this.location.back();
  }
}
