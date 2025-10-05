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

  setActive(tab: string) {
    this.active = tab;
    this.router.navigate(['/user/' + tab]);
  }
  getCurrentTab(): string {
    var urlList = this.currentPath.split('/');
    var path = urlList[urlList.length - 1]
    return path
  }

}
