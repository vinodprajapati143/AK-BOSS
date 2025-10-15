import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  active: string = 'dashboard';
  currentPath: string = '';
  constructor(private router: Router, private location: Location) {
    this.currentPath = this.location.path();
  }

   isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  // Check if current route starts with /user
  isUserRoute(): boolean {
    return this.router.url.startsWith('/user');
  } 
  
  setActive(tab: string) {
    this.active = tab;
    this.router.navigate(['/user/' + tab]);
    localStorage.setItem('activeTab', tab);
  }
  getCurrentTab(): string {
    var urlList = this.currentPath.split('/');
    var path = urlList[urlList.length - 1]
    return path
    return localStorage.getItem('activeTab') || 'dashboard';
  }

}
