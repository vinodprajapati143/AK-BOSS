import { Component, OnInit } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';
import { FloatingButtonsComponent } from "../../shared/floating-buttons/floating-buttons.component";
import { GameDisplayComponent } from "../../shared/game-display/game-display.component";
import { ApiService } from '../../core/services/api.service';
import { map, Subscription, timer } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, HeaderComponent, MarqureeComponent, FloatingButtonsComponent, GameDisplayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  games: any;
constructor(private router: Router, private gameService: ApiService ) {}
   
   chartData = [
    {
      day: 'सोम',
      num: 3,
      blocks: [
        { threeDigit: '689', twoDigit: '35' },
        { threeDigit: '366', twoDigit: '53' },
        { threeDigit: '223', twoDigit: '78' },
        { threeDigit: '666', twoDigit: '87' },
      ]
    },
    {
      day: 'मंगल',
      num: 2,
      blocks: [
        { threeDigit: '156', twoDigit: '27' },
        { threeDigit: '467', twoDigit: '72' },
        { threeDigit: '477', twoDigit: '89' },
        { threeDigit: '333', twoDigit: '98' },
      ] 
    },
    {
      day: 'बुध',
      num: 3,
      blocks: [
        { threeDigit: '779', twoDigit: '37' },
        { threeDigit: '359', twoDigit: '73' },
        { threeDigit: '134', twoDigit: '89' },
        { threeDigit: '478', twoDigit: '98' },
      ]
    },
    {
      day: 'गुरु',
      num: 3,
      blocks: [
        { threeDigit: '779', twoDigit: '35' },
        { threeDigit: '168', twoDigit: '53' },
        { threeDigit: '133', twoDigit: '79' },
        { threeDigit: '388', twoDigit: '97' },
      ]
    },
    {
      day: 'शुक्र',
      num: 5,
      blocks: [
        { threeDigit: '122', twoDigit: '56' },
        { threeDigit: '277', twoDigit: '65' },
        { threeDigit: '269', twoDigit: '78' },
        { threeDigit: '189', twoDigit: '87' },
      ]
    },
    {
      day: 'शनि',
      num: 2,
      blocks: [
        { threeDigit: '138', twoDigit: '25' },
        { threeDigit: '122', twoDigit: '52' },
        { threeDigit: '467', twoDigit: '79' },
        { threeDigit: '234', twoDigit: '97' },
      ]
    },
  ];


    tableData = [
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
  ];

   cards = [
    {
      title: 'Milan Morning',
      type: 'milan',
      line1: '1-6-3-8',
      line2: '119-114-238-288-567',
      line3: '13-18-63-68-31-36-81-86',
    },
    {
      title: 'Kalyan Morning',
      type: 'kalyan',
      line1: '4-9-5-0',
      line2: '257-270-289-140-190',
      line3: '45-40-95-90-54-59-04-09',
    },
    // Repeat as needed
  ];

  countdowns: { [gameId: number]: { hours: string; minutes: string; seconds: string } } = {};
subscriptions: { [gameId: number]: Subscription } = {};

  ngOnInit(): void {
    this.loadpubligames()
  }

  startCountdown(game: any) {
  // Clear previous subscription if any
  if (this.subscriptions[game.id]) {
    this.subscriptions[game.id].unsubscribe();
  }

  const offset = 5.5 * 60 * 60 * 1000; // IST offset in ms

  this.subscriptions[game.id] = timer(0, 1000).pipe(
    map(() => {
      const nowUTC = new Date();
      const now = new Date(nowUTC.getTime() + offset); // current IST time

      // Parse today's date string for calculations
      const dateStr = now.toISOString().split('T')[0];

      // Get open and close date-times
      let openTime = new Date(`${dateStr}T${game.open_time}`);
      let closeTime = new Date(`${dateStr}T${game.close_time}`);

      // If close time is earlier than open, assume close is next day
      if (closeTime <= openTime) {
        closeTime.setDate(closeTime.getDate() + 1);
      }

      // Decide target time to countdown to based on phase & current time 
      let targetTime: Date;

      if (game.phase === 'waiting' || now < openTime) {
        targetTime = openTime;
      } else if (game.phase === 'open' && now >= openTime && now < closeTime) {
        targetTime = closeTime;
      } else {
        // Countdown to next open time (next day)
        openTime.setDate(openTime.getDate() + 1);
        targetTime = openTime;
      }

      let diff = targetTime.getTime() - now.getTime();

      if (diff < 0) diff = 0;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      };
    })
  ).subscribe(time => {
    this.countdowns[game.id] = time;
  });
}


  openChart() {
    this.router.navigate(['/admin/users']);
  }

   chartReport() {
   this.router.navigate(['/user/chart-report']);
  }

   todayReport() {
    this.router.navigate(['/user/today-report']);
  }

  loadpubligames(){
    this.gameService.getpublicGames().subscribe({
    next: (res) => {
      this.games = res.games;
      this.games.forEach((game: any) => this.startCountdown(game));
      console.log('this.games: ', this.games);
    },
    error: (err) => {
      console.error('Failed to fetch games', err);
    }
  });

  }

}
