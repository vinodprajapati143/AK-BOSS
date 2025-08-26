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

  // Har game ka openCountdown aur closeCountdown update karna
updateCountdowns() {
  const today = new Date().toISOString().split('T')[0]; // Current date
  const now = Date.now();

  const updateGame = (game: any) => {
    const openDateTime = new Date(`${today}T${game.open_time}`);
    const closeDateTime = new Date(`${today}T${game.close_time}`);

    game.openCountdown = isNaN(openDateTime.getTime()) ? 0 : Math.max(0, Math.floor((openDateTime.getTime() - now) / 1000));
    game.closeCountdown = isNaN(closeDateTime.getTime()) ? 0 : Math.max(0, Math.floor((closeDateTime.getTime() - now) / 1000));
  };

  this.comingSoonGames.forEach(updateGame);
  this.allGames.forEach(updateGame);
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
    const openActive = game.openCountdown > 0;
    const closeActive = game.closeCountdown > 0;
    const graceSeconds = this.getGraceCountdown(game);
    const graceActive = graceSeconds > 0;

    const openFilled = !!(game.patte1 || game.patte1_open);
    const closeFilled = !!(game.patte2 || game.patte2_close);

    if (openFilled && closeFilled) {
      // Both filled, both disable
      game.openInputEnabled = false;
      game.closeInputEnabled = false;
    } else if (graceActive && openFilled && !closeFilled && !openActive && !closeActive) {
      // Only close blank, open filled, grace period running
      game.openInputEnabled = false;
      game.closeInputEnabled = true;    // Enable only close input!
    } else if (graceActive && !openFilled && !closeFilled && !openActive && !closeActive) {
      // Both blank, grace period, dono enable
      game.openInputEnabled = true;
      game.closeInputEnabled = true;
    } else if (openActive && !openFilled) {
      game.openInputEnabled = true;
      game.closeInputEnabled = false;
    } else if (closeActive && !closeFilled) {
      game.openInputEnabled = false;
      game.closeInputEnabled = true;
    } else {
      game.openInputEnabled = false;
      game.closeInputEnabled = false;
    }
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
    this.comingSoonGames = res.futureOpen;
    this.allGames = res.allGames;

    // Dono arrays ke har game me countdown init karo
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    const initCountdown = (game: any) => {
      const openDateTime = new Date(`${today}T${game.open_time}`);
      const closeDateTime = new Date(`${today}T${game.close_time}`);
      const now = Date.now();

      game.openCountdown = isNaN(openDateTime.getTime()) ? 0 : Math.max(0, Math.floor((openDateTime.getTime() - now) / 1000));
      game.closeCountdown = isNaN(closeDateTime.getTime()) ? 0 : Math.max(0, Math.floor((closeDateTime.getTime() - now) / 1000));
    };

    this.comingSoonGames.forEach(initCountdown);
    this.allGames.forEach(initCountdown);

    this.setInputEnabledFlags();
    // Timer start karo agar already start nahi hua ho
    if (!this.timerSubscription) {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.updateCountdowns();
      });
    }
  });
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
