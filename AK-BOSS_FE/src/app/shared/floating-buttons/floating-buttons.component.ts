import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './floating-buttons.component.html',
  styleUrl: './floating-buttons.component.scss'
})
export class FloatingButtonsComponent {
  constructor(private router: Router) { }
  openChart() {
    this.router.navigate(['/admin/users']);
  }

  chartReport() {
    this.router.navigate(['/user/chart-report']);
  }

  todayReport() {
    this.router.navigate(['/user/today-report']);
  }
}
