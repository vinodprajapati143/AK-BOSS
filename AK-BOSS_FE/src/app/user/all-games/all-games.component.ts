import { Component, inject } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NgFor, Location, CommonModule } from '@angular/common';
import { AdminRoutingModule } from "../../admin/admin-routing.module";
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { GamedataService } from '../../core/services/gamedata.service';
import { PlayGameComponent } from '../play-game/play-game.component';
import { take } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';


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
  gameService = inject(ApiService); 
  location = inject(Location);
  gameName: string = '';
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


ngOnInit() {
  this.gameDataService.getGameData().pipe(take(1)).subscribe((gameData) => {
    this.gameName = gameData.name;
  });
}



onGameClick(item: any) {
  console.log('item: ', item);

  this.gameDataService.getGameData().pipe(take(1)).subscribe((gameData) => {
    console.log('gameData: ', gameData);

    let canProceed = true;

    // 🚫 Only restrict jodi
    if (item.entryType === 'jodi') {
      const currentTime = new Date();

      // Parse open_time (e.g., "5:15 PM")
      const [hours, minutesPart] = gameData.open_time.split(':');
      const [minutes, meridian] = minutesPart.split(' ');
      let openHour = parseInt(hours, 10);
      const openMinute = parseInt(minutes, 10);

      if (meridian === 'PM' && openHour !== 12) openHour += 12;
      if (meridian === 'AM' && openHour === 12) openHour = 0;

      const openTime = new Date();
      openTime.setHours(openHour, openMinute, 0, 0);

      console.log('Current Time:', currentTime);
      console.log('Open Time:', openTime);

      if (currentTime > openTime) {
        alert(`You cannot make an entry. ${gameData.name} open time is already over (${gameData.open_time}).`);
        canProceed = false;
      }
    }

    // ✅ Proceed if allowed
    if (canProceed) {
      this.gameDataService.updateEntryType(item.entryType);
      this.router.navigate(['/user/play']);
      this.menuItems.forEach(i => (i.active = false));
      item.active = true;
      this.selectedGame = item;
    }
  });
}




 
 



  back() {
    this.location.back();
  }
}
