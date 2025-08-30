import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';
import { FloatingButtonsComponent } from "../../shared/floating-buttons/floating-buttons.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-penal-report',
  standalone: true,
  imports: [MarqureeComponent, HeaderComponent, FloatingButtonsComponent],
  templateUrl: './penal-report.component.html',
  styleUrl: './penal-report.component.scss'
})
export class PenalReportComponent {
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
