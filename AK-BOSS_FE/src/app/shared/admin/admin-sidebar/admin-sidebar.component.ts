import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {

  links = [{
    "img": "home",
    "href": "/admin/users",
    "text": "Home",
    "active": true
  },
  {
    "img": "gamepad",
    "href": "/admin/all-game",
    "text": "Game",
    "active": false
  },
  {
    "img": "referral",
    "href": "/admin/users",
    "text": "Members",
    "active": false
  },
  {
    "img": "report",
    "href": "/admin/reports",
    "text": "Reports",
    "active": false
  },
  {
    "img": "referral",
    "href": "/admin/referral",
    "text": "Referral",
    "active": false
  },
  {
    "img": "help",
    "href": "/admin/help",
    "text": "Help",
    "active": false
  },
  {
    "img": "logout",
    "href": "#",
    "text": "LogOut",
    "active": false
  }]

  subLinks = [{
    "img": "gamepad",
    "text": "All Game",
    "href": "/admin/all-game",
    "active": true
  },
  {
    "img": "gamepad",
    "text": "Add Games",
    "href": "/admin/add-game",
    "active": false
  },
  ]
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

  getImageUrl(img: string, active: boolean | undefined) {
    return `/assets/images/dashboard/icons/${img}${active ? '-white' : ''}.svg`
  }
}
