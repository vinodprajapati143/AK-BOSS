import { Component, inject } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NgFor, Location } from '@angular/common';
import { AdminRoutingModule } from "../../admin/admin-routing.module";
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { GamedataService } from '../../core/services/gamedata.service';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, NgFor, AdminRoutingModule,],
  templateUrl: './all-games.component.html',
  styleUrl: './all-games.component.scss'
})
export class AllGamesComponent {
  router = inject(Router);
  gameDataService = inject(GamedataService);
  location = inject(Location);


  menuItems = [
    { title: 'Single Ank', icon: 'assets/images/dice.png', route: '/user/play' },
    { title: 'Jodi', icon: 'assets/images/dice.png', route: '/user/jodi' },
    { title: 'Single Panna', icon: 'assets/images/dice.png', route: '/user/single-panna' },
    { title: 'Double Panna', icon: 'assets/images/dice.png', route: '/user/double-panna' },
    { title: 'Triple Panna', icon: 'assets/images/dice.png', route: '/user/triple-panna' },
    { title: 'Half Sangam A', icon: 'assets/images/dice.png', route: '/user/half-sangam-a' },
    { title: 'Full Sangam', icon: 'assets/images/dice.png', route: '/user/full-sangam' }
  ];

  routeEntryTypeMap: any = {
    '/user/play': 'singleank',
    '/user/jodi': 'jodi',
    '/user/single-panna': 'singlepanna',
    '/user/double-panna': 'doublepanna',
    '/user/triple-panna': 'triplepanna',
    '/user/half-sangam-a': 'halfsangama',
    '/user/full-sangam': 'fullsangam'
  };

  onGameClick(item: any) {
    const entrytype = this.routeEntryTypeMap[item.route];
    this.gameDataService.updateEntryType(entrytype);
    this.router.navigate([item.route]);
  }

  back() {
    this.location.back();
  }
}
