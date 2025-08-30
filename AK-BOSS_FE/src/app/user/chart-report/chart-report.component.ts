import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';
import { FloatingButtonsComponent } from "../../shared/floating-buttons/floating-buttons.component";

@Component({
  selector: 'app-chart-report',
  standalone: true,
  imports: [MarqureeComponent, CommonModule, HeaderComponent, FloatingButtonsComponent],
  templateUrl: './chart-report.component.html',
  styleUrl: './chart-report.component.scss'
})
export class ChartReportComponent {

   goBack() {
    window.history.back();
  }

    scrollTo(target: string) {
  const element = document.getElementById(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
}
