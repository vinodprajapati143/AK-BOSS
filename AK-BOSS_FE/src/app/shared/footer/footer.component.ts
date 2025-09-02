import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  active: string = 'dashboard';

  constructor(private router: Router) {}

   setActive(tab: string) {
    this.active = tab;
    this.router.navigate(['/user/' + tab]); // yaha navigate karega
  }
  

}
