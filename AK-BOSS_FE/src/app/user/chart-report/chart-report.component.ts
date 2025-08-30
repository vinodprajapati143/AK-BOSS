import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';
import { FloatingButtonsComponent } from "../../shared/floating-buttons/floating-buttons.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart-report',
  standalone: true,
  imports: [MarqureeComponent, CommonModule, HeaderComponent, FloatingButtonsComponent],
  templateUrl: './chart-report.component.html',
  styleUrl: './chart-report.component.scss'
})
export class ChartReportComponent {
  router = inject(Router);

   goBack() {
    this.router.navigate(['/user/home']);
  }

    scrollTo(target: string) {
  const element = document.getElementById(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
}
