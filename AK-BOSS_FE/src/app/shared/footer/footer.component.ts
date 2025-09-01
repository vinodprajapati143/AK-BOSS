import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  active: string = 'dashboard';

  constructor(private router: Router) {}

   setActive(tab: string) {
    this.active = tab;
    this.router.navigate(['/' + tab]); // yaha navigate karega
  }
  

}
