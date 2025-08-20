import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';

@Component({
  selector: 'app-penal-report',
  standalone: true,
  imports: [MarqureeComponent, HeaderComponent],
  templateUrl: './penal-report.component.html',
  styleUrl: './penal-report.component.scss'
})
export class PenalReportComponent {

    goBack() {
    window.history.back();
  }

}
