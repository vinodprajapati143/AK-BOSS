import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from "../../shared/admin/admin-sidebar/admin-sidebar.component";
import { ApiService } from '../../core/services/api.service';
import { Game } from '../../core/module/models';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
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
export class AllGameComponent implements OnInit ,OnDestroy  {
 private apiService = inject(ApiService); 
 private toastr = inject(ToastrService)

 comingSoonGames: any[] = [];
allGames: any[] = [];
  
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
  timerSubscription: Subscription | undefined;
 
games = [];
ngOnInit() {
  this.loadGames();
      // 1 second ka interval set karo jo countdown update kare
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateCountdowns();
    });
}

updateCountdowns() {
    const now = new Date();

    const updateGame = (game: any) => {
      const openDateTime = this.getGameDateTime(now, game.open_time, !!game.is_next_day_close);
      const closeDateTime = this.getGameDateTime(now, game.close_time, !!game.is_next_day_close);

      const nowTime = now.getTime();

      game.openCountdown = isNaN(openDateTime.getTime())
        ? 0
        : Math.max(0, Math.floor((openDateTime.getTime() - nowTime) / 1000));

      game.closeCountdown = isNaN(closeDateTime.getTime())
        ? 0
        : Math.max(0, Math.floor((closeDateTime.getTime() - nowTime) / 1000));
    };

    this.comingSoonGames.forEach(updateGame);
    this.allGames.forEach(updateGame);

    this.setInputEnabledFlags();
  }


getGameDateTime(baseDate: Date, timeStr: string, isNextDay: boolean): Date {
  // timeStr = "23:30:00"
  const [h, m, s] = timeStr.split(':').map(Number);
  const d = new Date(baseDate); // Start with today
  d.setHours(h, m, s || 0, 0);

  if (isNextDay && h < 12) {
    d.setDate(d.getDate() + 1); // next day
  }
  return d;
}

isOpenInputEnabled(game: any): boolean {
  // Open countdown > 0 and input not filled
  return game.openCountdown > 0 && (!game.patte1 || !game.patte1_open);
}
isCloseInputEnabled(game: any): boolean {
  return game.closeCountdown > 0 && (!game.patte2 || !game.patte2_close);
}

getGraceCountdown(game: any): number {
  // Calculate seconds till grace period ends
  const today = new Date().toISOString().split('T')[0];

  // Take max(close, open) time
  const openDT = new Date(`${today}T${game.open_time}`);
  const closeDT = new Date(`${today}T${game.close_time}`);
  const graceWindowEnd = new Date(Math.max(openDT.getTime(), closeDT.getTime()) + (60 * 60 * 1000)); // 1 hour after window ends
  const now = new Date();

  // Seconds remaining in grace period
  return Math.max(0, Math.floor((graceWindowEnd.getTime() - now.getTime()) / 1000));
}


setInputEnabledFlags() {
    this.comingSoonGames.forEach(game => {
      const openWindowStarted = game.openCountdown <= (2.5 * 60 * 60) && game.openCountdown > 0;
      const closeWindowStarted = game.closeCountdown <= (2.5 * 60 * 60) && game.closeCountdown > 0;

      const openFilled = !!(game.patte1 || game.patte1_open);
      const closeFilled = !!(game.patte2 || game.patte2_close);

      if (openWindowStarted && !openFilled) {
        game.openInputEnabled = true;
        game.closeInputEnabled = false;
        return;
      }

      if (game.openCountdown <= 0 && !openFilled) {
        game.openInputEnabled = true;
        game.closeInputEnabled = false;
        return;
      }

      if (closeWindowStarted && !closeFilled) {
        game.openInputEnabled = false;
        game.closeInputEnabled = true;
        return;
      }

      if (game.closeCountdown <= 0 && !closeFilled) {
        game.openInputEnabled = false;
        game.closeInputEnabled = true;
        return;
      }

      if (openFilled && closeFilled) {
        game.openInputEnabled = false;
        game.closeInputEnabled = false;
        return;
      }

      game.openInputEnabled = false;
      game.closeInputEnabled = false;
    });
  }




 

  ngOnDestroy() {
    // Component destroy hone par subscription clean karo
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }


loadGames() {
    this.apiService.getNearestGames().subscribe((res: any) => {
      const apiGames = res.data.comingSoonGames;

      // Preserve user edits if needed (optional)
      apiGames.forEach((game: any) => {
        const existing = this.comingSoonGames.find(g => g.id === game.id);
        if (existing) {
          game.patte1 = existing.patte1;
          game.patte1_open = existing.patte1_open;
          game.patte2_close = existing.patte2_close;
          game.patte2 = existing.patte2;
        }
      });

      this.comingSoonGames = apiGames;
      this.allGames = res.data.allGames;

      // Initialize countdowns for all games
      const now = new Date();

      const initCountdown = (game: any) => {
        const openDateTime = this.getGameDateTime(now, game.open_time, !!game.is_next_day_close);
        const closeDateTime = this.getGameDateTime(now, game.close_time, !!game.is_next_day_close);

        const nowTime = now.getTime();

        game.openCountdown = isNaN(openDateTime.getTime())
          ? 0
          : Math.max(0, Math.floor((openDateTime.getTime() - nowTime) / 1000));

        game.closeCountdown = isNaN(closeDateTime.getTime())
          ? 0
          : Math.max(0, Math.floor((closeDateTime.getTime() - nowTime) / 1000));
      };

      this.comingSoonGames.forEach(initCountdown);
      this.allGames.forEach(initCountdown);

      this.setInputEnabledFlags();

      if (!this.timerSubscription) {
        this.timerSubscription = interval(1000).subscribe(() => {
          this.updateCountdowns();
        });
      }
    });
  }

restrictToThreeDigits(value: any): string {
  // Only allow up to 3 digits, and only numbers
  value = value ? value.toString().replace(/\D/g, '') : '';
  return value.slice(0, 3);
}

restrictToOneDigit(value: any): string {
  // Only allow 1 digit, and only numbers
  value = value ? value.toString().replace(/\D/g, '') : '';
  return value.slice(0, 1);
}

  
submitGame(game: any) {
  const payload = {
    id: game.id,
    patte1: game.patte1,
    patte1_open: game.patte1_open,
    patte2_close: game.patte2_close,
    patte2: game.patte2
  };

  this.apiService.saveGameInput(payload).subscribe({
    next: (res) => {
      console.log('res: ', res);
      alert('Game input saved successfully!');
      this.loadGames(); // Reload games list after successful save
    },
    error: (err) => {
      console.error(err);
      alert('Error saving game input');
    }
  });
}

 
 


// helper for countdowns
formatTime(seconds: number): string {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '00:00:00';
  }
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}


  getImageUrl(img: string, active: boolean | undefined) {
    return `/assets/images/dashboard/icons/${img}${active ? '-white' : ''}.svg`
  }

  allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  // Allow only 0–9 (ASCII codes 48 to 57)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
  }

  blockPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('tel') || '';
    if (!/^\d+$/.test(pastedText)) {
      event.preventDefault(); // Prevent pasting non-digit text
    }
  }
}
