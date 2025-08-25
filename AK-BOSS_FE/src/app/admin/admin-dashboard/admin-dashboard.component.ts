import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../shared/admin/admin-sidebar/admin-sidebar.component';
import { ApiService } from '../../core/services/api.service';
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
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit  {
 private apiService = inject(ApiService); 
  // users: User[] = [
  //   {
  //     name: 'Deepak Sharma',
  //     enabled: false,
  //     date: '25-04-2025',
  //     phone: '8979108932',
  //     amountPaid: '₹ 15,000',
  //     totalAmount: '₹ 15,000',
  //     id: 123
  //   },
  //   {
  //     name: 'Deepak Sharma',
  //     enabled: true,
  //     date: '25-04-2025',
  //     phone: '8979108932',
  //     amountPaid: '₹ 15,000',
  //     totalAmount: '₹ 15,000',
  //     id: 123
  //   },
  //   {
  //     name: 'Deepak Sharma',
  //     enabled: false,
  //     date: '25-04-2025',
  //     phone: '8979108932',
  //     amountPaid: '₹ 15,000',
  //     totalAmount: '₹ 15,000',
  //     id: 123
  //   },
  //   {
  //     name: 'Deepak Sharma',
  //     enabled: false,
  //     date: '25-04-2025',
  //     phone: '8979108932',
  //     amountPaid: '₹ 15,000',
  //     totalAmount: '₹ 15,000',
  //     id: 123
  //   },
  //   {
  //     name: 'Deepak Sharma',
  //     enabled: false,
  //     date: '25-04-2025',
  //     phone: '8979108932',
  //     amountPaid: '₹ 15,000',
  //     totalAmount: '₹ 15,000',
  //     id: 123
  //   },
  //   {
  //     name: 'Deepak Sharma',
  //     enabled: false,
  //     date: '25-04-2025',
  //     phone: '8979108932',
  //     amountPaid: '₹ 15,000',
  //     totalAmount: '₹ 15,000',
  //     id: 123
  //   },
  //   {
  //     name: 'Deepak Sharma',
  //     enabled: false,
  //     date: '25-04-2025',
  //     phone: '8979108932',
  //     amountPaid: '₹ 15,000',
  //     totalAmount: '₹ 15,000',
  //     id: 123
  //   },
  //   {
  //     name: 'Deepak Sharma',
  //     enabled: false,
  //     date: '25-04-2025',
  //     phone: '8979108932',
  //     amountPaid: '₹ 15,000',
  //     totalAmount: '₹ 15,000',
  //     id: 123
  //   },

  // ];
  users: any[] = [];
  loading = true;

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
      icon: '/assets/admin-dashboard/icons/triangle.svg'
    },
    {
      title: 'Active users',
      value: 20,
      percentage: '2.67%',
      direction: 'up',
      color: '#FFA726',
      bgColor: '#FF9F4330',
      compareText: 'Than last week',
      icon: '/assets/admin-dashboard/icons/triangle.svg'
    },
    {
      title: 'On way order',
      value: 57,
      percentage: '0.67%',
      direction: 'down',
      color: '#64B5F6',
      bgColor: '#8ECAE630',
      compareText: 'Than last week',
      icon: '/assets/admin-dashboard/icons/triangle-down.svg'
    },
    {
      title: 'Disabled user',
      value: 98,
      percentage: '2.67%',
      direction: 'down',
      color: '#EF5350',
      bgColor: '#F1656530',
      compareText: 'Than last week',
      icon: '/assets/admin-dashboard/icons/triangle-down.svg'
    }
  ];

   ngOnInit(): void {
    this.loadUsers();
  }

  getImageUrl(img: string, active: boolean | undefined) {
    return `/assets/admin-dashboard/icons/${img}${active ? '-white' : ''}.svg`
  }



    loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (res:any) => {
        this.users = res.data; // ✅ backend से जो data आया वो assign करो
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching games', err);
        this.loading = false;
      }
    });
  }
}
