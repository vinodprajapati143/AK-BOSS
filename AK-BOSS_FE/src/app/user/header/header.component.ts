import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router) {}

 openWallet() {
     this.router.navigate(['/user/add-amount']);
  }

   openProfile() {
     this.router.navigate(['/user/profile']);
  }
}
