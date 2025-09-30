import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../core/services/storage.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

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
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  constructor(
    private router: Router,
    private strorageservice: StorageService,
    private toaster: ToastrService,
    private backendservice: ApiService
  ) {}

  links = [
    { img: 'home', href: '/admin/dashboard', text: 'Home', active: true },
    { img: 'gamepad', href: '/admin/all-game', text: 'Game', active: false },
    { img: 'referral', href: '/admin/users', text: 'Members', active: false },
    { img: 'report', href: '/admin/bal-transfer', text: 'Payment', active: false },

    {
      img: 'referral',
      href: '/admin/referral',
      text: 'Referral',
      active: false,
    },
    { img: 'help', href: '/admin/help', text: 'Help', active: false },
  ];

  subLinksMap: any = {
    Home: [
      {
        img: 'home',
        text: 'Dashboard',
        href: '/admin/dashboard',
        active: true,
      },
    ],
    Game: [
      {
        img: 'gamepad',
        text: 'All Game',
        href: '/admin/all-game',
        active: false,
      },
      {
        img: 'gamepad',
        text: 'Add Games',
        href: '/admin/add-game',
        active: false,
      },
    ],
    Members: [
      {
        img: 'referral',
        text: 'Member',
        href: '/admin/users',
        active: false,
      },
       {
        img: 'referral',
        text: 'All Member',
        href: '/admin/all-users',
        active: false,
      },
    ],
       Payment: [
      {
        img: 'report',
        text: 'Balance Transfer',
        href: '/admin/bal-transfer',
        active: false,
      },
      {
        img: 'report',
        text: 'Balance Return',
        href: '/admin/bal-return',
        active: false,
      },
        {
        img: 'report',
        text: 'Bal Return Request',
        href: '/admin/bal-return-request',
        active: false,
      },
        {
        img: 'report',
        text: 'Payment Request view',
        href: '/admin/payment-request-view',
        active: false,
      },
        {
        img: 'report',
        text: 'Purchase Balance',
        href: '/admin/purchase-balance',
        active: false,
      },
    ],
    Referral: [
      {
        img: 'referral',
        text: 'My Referrals',
        href: '/admin/referral',
        active: false,
      },
    ],
    Help: [{ img: 'help', text: 'FAQ', href: '/admin/help', active: false }],
  };

  // by default current submenu (based on active link)
  currentSubLinks: any[] =
    this.subLinksMap[this.links.find((l) => l.active)?.text || 'Home'];

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.highlightMenu(event.urlAfterRedirects);
      });

    // first load ke liye bhi check
    this.highlightMenu(this.router.url);
  }

  setActiveMenu(menu: any) {
    this.links.forEach((l) => (l.active = false));
    menu.active = true;
    this.currentSubLinks = this.subLinksMap[menu.text] || [];
  }

  highlightMenu(url: string) {
    this.links.forEach((l) => (l.active = false));

    for (let menu in this.subLinksMap) {
      const found = this.subLinksMap[menu].find((s: any) =>
        url.startsWith(s.href)
      );

      if (found) {
        const left = this.links.find((l) => l.text === menu);
        if (left) left.active = true;

        this.currentSubLinks = this.subLinksMap[menu];

        // subLinks ke andar bhi active flag set karo
        this.currentSubLinks.forEach((s: any) => {
          s.active = url.startsWith(s.href);
        });

        break;
      }
    }
  }

  cardsData = [
    {
      title: 'Total users',
      value: 12,
      percentage: '2.67%',
      direction: 'up',
      color: '#00D457',
      bgColor: '#00D45730',
      compareText: 'Than last week',
      icon: '/assets/images/dashboard/icons/triangle.svg',
    },
    {
      title: 'Active users',
      value: 20,
      percentage: '2.67%',
      direction: 'up',
      color: '#FFA726',
      bgColor: '#FF9F4330',
      compareText: 'Than last week',
      icon: '/assets/images/dashboard/icons/triangle.svg',
    },
    {
      title: 'On way order',
      value: 57,
      percentage: '0.67%',
      direction: 'down',
      color: '#64B5F6',
      bgColor: '#8ECAE630',
      compareText: 'Than last week',
      icon: '/assets/images/dashboard/icons/triangle-down.svg',
    },
    {
      title: 'Disabled user',
      value: 98,
      percentage: '2.67%',
      direction: 'down',
      color: '#EF5350',
      bgColor: '#F1656530',
      compareText: 'Than last week',
      icon: '/assets/images/dashboard/icons/triangle-down.svg',
    },
  ];

  getImageUrl(img: string, active: boolean | undefined) {
    return `/assets/images/dashboard/icons/${img}${active ? '-white' : ''}.svg`;
  }

  logout() {
    this.backendservice.logout({}).subscribe({
      next: (res: any) => {
        this.toaster.success(res.message);
        this.strorageservice.removeItem('authToken');
        this.strorageservice.clear();
        this.strorageservice.clearCookies();

        this.router.navigate(['/user/home']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.strorageservice.removeItem('authToken');
        // this.router.navigate(['/home']);
      },
    });
  }
}
