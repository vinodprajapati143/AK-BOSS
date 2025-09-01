import { Component, OnInit } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';
import { FloatingButtonsComponent } from "../../shared/floating-buttons/floating-buttons.component";
import { GameDisplayComponent } from "../../shared/game-display/game-display.component";
import { ApiService } from '../../core/services/api.service';
import { interval, map, startWith, Subscription, timer } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, HeaderComponent, MarqureeComponent, FloatingButtonsComponent, GameDisplayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  games: any;
  gamesResult: any;
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
     this.loadpubligamesResult()
  }

  now$ = interval(60_000).pipe(
    startWith(0),
    map(() => new Date())
  )

startCountdown(game: any) {
  // Unsubscribe previous timer if it exists
  if (this.subscriptions[game.id]) {
    this.subscriptions[game.id].unsubscribe();
  }

  this.subscriptions[game.id] = timer(0, 1000).pipe(
    map(() => {
      const nowUTC = new Date();

      // Parse open_time and close_time strings into numbers
      const [openH, openM, openS] = (game.open_time || "00:00:00").split(':').map(Number);
      const [closeH, closeM, closeS] = (game.close_time || "00:00:00").split(':').map(Number);

      // Get today's date in UTC parts
      const yearUTC = nowUTC.getUTCFullYear();
      const monthUTC = nowUTC.getUTCMonth();
      const dateUTC = nowUTC.getUTCDate();

      // Construct open and close times in UTC corresponding to IST by subtracting 5.5 hours from IST target
      // IST = UTC + 5:30, so subtract 5h30m to get UTC
      const openDateTimeUTC = new Date(Date.UTC(yearUTC, monthUTC, dateUTC, openH - 5, openM - 30, openS));
      const closeDateTimeUTC = new Date(Date.UTC(yearUTC, monthUTC, dateUTC, closeH - 5, closeM - 30, closeS));

      // Adjust if minutes became negative after subtracting 30
      if (openDateTimeUTC.getUTCMinutes() < 0) {
        openDateTimeUTC.setUTCHours(openDateTimeUTC.getUTCHours() - 1);
        openDateTimeUTC.setUTCMinutes(openDateTimeUTC.getUTCMinutes() + 60);
      }
      if (closeDateTimeUTC.getUTCMinutes() < 0) {
        closeDateTimeUTC.setUTCHours(closeDateTimeUTC.getUTCHours() - 1);
        closeDateTimeUTC.setUTCMinutes(closeDateTimeUTC.getUTCMinutes() + 60);
      }

      // If close time is earlier or equal to open time, close time is next day
      if (closeDateTimeUTC <= openDateTimeUTC) {
        closeDateTimeUTC.setUTCDate(closeDateTimeUTC.getUTCDate() + 1);
      }

      // Determine target countdown time according to current time and phase
      let targetTimeUTC: Date;

      if (nowUTC < openDateTimeUTC) {
        // Before open time
        targetTimeUTC = openDateTimeUTC;
      } else if (nowUTC >= openDateTimeUTC && nowUTC < closeDateTimeUTC) {
        // During open-close interval
        targetTimeUTC = closeDateTimeUTC;
      } else {
        // After close time, countdown to next day's open
        openDateTimeUTC.setUTCDate(openDateTimeUTC.getUTCDate() + 1);
        targetTimeUTC = openDateTimeUTC;
      }

      // Calculate difference in milliseconds
      let diffMs = targetTimeUTC.getTime() - nowUTC.getTime();
      if (diffMs < 0) diffMs = 0;

      // Calculate hours, minutes, seconds
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

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

chartReport(game: any) {
  console.log('game: ', game);
  this.router.navigate(['/user/chart-report'], { queryParams: { gameId: game.id } });
}

   todayReport(game:any) {
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

    loadpubligamesResult(){
    this.gameService.getpublicGamesResult().subscribe({
    next: (res) => {
      console.log('res: ', res);
      this.gamesResult = res.games;
      console.log('this.gamesResult: ', this.gamesResult);
    },
    error: (err) => {
      console.error('Failed to fetch games', err);
    }
  });

  }

}
