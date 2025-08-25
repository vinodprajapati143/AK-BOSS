import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from "../../shared/admin/admin-sidebar/admin-sidebar.component";
import { ApiService } from '../../core/services/api.service';
import { Game } from '../../core/module/models';
import { FormsModule } from '@angular/forms';
export interface User {
  name: string;
  enabled: boolean;
  date: string;
  phone: string;
  amountPaid: string;
  totalAmount: string;
  id: number | string;
}
@Component({
  selector: 'app-all-game',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, FormsModule],
  templateUrl: './all-game.component.html',
  styleUrl: './all-game.component.scss'
})
export class AllGameComponent implements OnInit  {
 private apiService = inject(ApiService); 
  games: Game[] = [];
  links = [{
    "img": "home",
    "text": "Home",
    "active": true
  },
  {
    "img": "report",
    "text": "Reports",
    "active": false
  },
  {
    "img": "referral",
    "text": "Referral",
    "active": false
  },
  {
    "img": "help",
    "text": "Help",
    "active": false
  },
  {
    "img": "help",
    "text": "Help",
    "active": false
  },
  {
    "img": "help",
    "text": "Help",
    "active": false
  },
  {
    "img": "logout",
    "text": "LogOut",
    "active": false
  }]
  
  subLinks = [{
    "img": "gamepad",
    "text": "All Game",
    "active": true
  },
  {
    "img": "gamepad",
    "text": "Add Games",
    "active": false
  },
   {
    "img": "gamepad",
    "text": "Add Games",
    "active": false
  },
   {
    "img": "gamepad",
    "text": "Add Games",
    "active": false
  },
   {
    "img": "gamepad",
    "text": "Add Games",
    "active": false
  },
  {
    "img": "referral",
    "text": "Referral",
    "active": false
  },
  {
    "img": "help",
    "text": "Help",
    "active": false
  },
  {
    "img": "logout",
    "text": "LogOut",
    "active": false
  }]
  cardsData = [
    {
      title: 'Total users',
      value: 12,
      percentage: '2.67%',
      direction: 'up',
      color: '#00D457',
      bgColor: '#00D45730',
      compareText: 'Than last week',
      icon: '/assets/images/dashboard/icons/triangle.svg'
    },
    {
      title: 'Active users',
      value: 20,
      percentage: '2.67%',
      direction: 'up',
      color: '#FFA726',
      bgColor: '#FF9F4330',
      compareText: 'Than last week',
      icon: '/assets/images/dashboard/icons/triangle.svg'
    },
    {
      title: 'On way order',
      value: 57,
      percentage: '0.67%',
      direction: 'down',
      color: '#64B5F6',
      bgColor: '#8ECAE630',
      compareText: 'Than last week',
      icon: '/assets/images/dashboard/icons/triangle-down.svg'
    },
    {
      title: 'Disabled user',
      value: 98,
      percentage: '2.67%',
      direction: 'down',
      color: '#EF5350',
      bgColor: '#F1656530',
      compareText: 'Than last week',
      icon: '/assets/images/dashboard/icons/triangle-down.svg'
    }
  ];


 ngOnInit(): void {
     this.loadGames();
  }

loadGames() {
    this.apiService.getNearestGames().subscribe((games: any[]) => {
      const now = Date.now();

      this.games = games.map((game, index) => {
        const [openH, openM, openS] = game.open_time.split(':').map(Number);
        const [closeH, closeM, closeS] = game.close_time.split(':').map(Number);

        let openTime = new Date();
        openTime.setHours(openH, openM, openS, 0);

        let closeTime = new Date();
        closeTime.setHours(closeH, closeM, closeS, 0);

        // Midnight cross handle
        if (closeTime.getTime() < openTime.getTime()) {
          closeTime = new Date(closeTime.getTime() + 24 * 60 * 60 * 1000);
        }

        const openWindowStart = openTime.getTime() - 30 * 60 * 1000;
        const closeWindowStart = closeTime.getTime() - 30 * 60 * 1000;

        return {
          ...game,
          index,
          openTime: openTime.getTime(),
          closeTime: closeTime.getTime(),
          openWindowStart,
          closeWindowStart,
          openCountdown: Math.max(openTime.getTime() - now, 0),
          closeCountdown: Math.max(closeTime.getTime() - now, 0),
          openInputEnabled: false,
          closeInputEnabled: false,
          submitted: false,
          patte1: '',
          patte1_open: '',
          patte2_close: '',
          patte2: ''
        };
      })
      .filter(game => {
        const nowMs = Date.now();
        const showOpen = nowMs >= game.openWindowStart && nowMs <= game.openTime;
        const showClose = nowMs >= game.closeWindowStart && nowMs <= game.closeTime;
        return showOpen || showClose;
      });

      // Timer update every second
      setInterval(() => {
        const nowMs = Date.now();
        this.games.forEach(game => {
          if (!game.submitted) {
            game.openCountdown = Math.max(game.openTime - nowMs, 0);
            game.closeCountdown = Math.max(game.closeTime - nowMs, 0);

            // Enable inputs only during their window
            game.openInputEnabled = nowMs >= game.openWindowStart && nowMs <= game.openTime;
            game.closeInputEnabled = nowMs >= game.closeWindowStart && nowMs <= game.closeTime;
          }
        });
      }, 1000);
    });
  }

  submitGame(game: any) {
  // Validation: open/close inputs jo editable hain unko check karo
  let valid = true;

  // // Open inputs validation (tabhi check karo agar value edit hui ho)
  // if ((game.openInputEnabled || game.openCountdown <= 0) && (!game.patte1 || !game.patte1_open)) {
  //   valid = false;
  // }

  // // Close inputs validation
  // if ((game.closeInputEnabled || game.closeCountdown <= 0) && (!game.patte2_close || !game.patte2)) {
  //   valid = false;
  // }

  if (!valid) {
    alert('Please fill all inputs before submitting!');
    return;
  }

  // Payload for DB
  const payload = {
    id: game.id,
    game_name: game.game_name,
    open_time: game.open_time,
    close_time: game.close_time,
    patte1: game.patte1,
    patte1_open: game.patte1_open,
    patte2_close: game.patte2_close,
    patte2: game.patte2
  };

  console.log('Payload to save:', payload);

  // // Call API to save
  // this.apiService.saveGameInput(payload).subscribe({
  //   next: (res) => {
  //     console.log('Saved successfully:', res);
  //     game.submitted = true;
  //     this.games = this.games.filter(g => !g.submitted);
  //   },
  //   error: (err) => {
  //     console.error('Error saving:', err);
  //     alert('Failed to save, try again.');
  //   }
  // });
  }



allGames: any[] = []; // ye HTML me use hoga

processGamesWithTimers(games: any[]) {
  const now = new Date().getTime();

  // Process games
  this.allGames = games.map(game => {
    // Parse HH:MM:SS
    const [openH, openM, openS] = game.open_time.split(':').map(Number);
    const [closeH, closeM, closeS] = game.close_time.split(':').map(Number);

    let openTime = new Date();
    openTime.setHours(openH, openM, openS, 0);
    let closeTime = new Date();
    closeTime.setHours(closeH, closeM, closeS, 0);

    // Midnight cross
    if (closeTime.getTime() < openTime.getTime()) {
      closeTime = new Date(closeTime.getTime() + 24*60*60*1000);
    }

    return {
      ...game,
      openTime: openTime.getTime(),
      closeTime: closeTime.getTime(),
      openCountdown: Math.max(openTime.getTime() - now, 0),
      closeCountdown: Math.max(closeTime.getTime() - now, 0)
    };
  });

  // Countdown update every second
  setInterval(() => {
    const nowMs = new Date().getTime();
    this.allGames.forEach(game => {
      game.openCountdown = Math.max(game.openTime - nowMs, 0);
      game.closeCountdown = Math.max(game.closeTime - nowMs, 0);
    });
  }, 1000);
}



  formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600).toString().padStart(2,'0');
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2,'0');
    const s = (totalSec % 60).toString().padStart(2,'0');
    return `${h}:${m}:${s}`;
  }

  getImageUrl(img: string, active: boolean | undefined) {
    return `/assets/images/dashboard/icons/${img}${active ? '-white' : ''}.svg`
  }
}
