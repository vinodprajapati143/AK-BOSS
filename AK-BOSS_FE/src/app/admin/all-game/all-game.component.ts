import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from "../../shared/admin/admin-sidebar/admin-sidebar.component";
import { ApiService } from '../../core/services/api.service';
import { Game } from '../../core/module/models';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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

 

ngOnInit() {
  this.loadGames();
}


  loadGames() {
    this.apiService.getNearestGames().subscribe(res => {
      // Filter based on status
      this.comingSoonGames = res.filter(g => g.status === 'coming_soon');
      this.allGames = res.filter(g => g.status !== 'coming_soon');
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
      },
      error: (err) => {
        console.error(err);
        alert('Error saving game input');
      }
    });
  }
 
 


// helper for countdowns
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
