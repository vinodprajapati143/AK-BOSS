import { Component } from '@angular/core';
import { MarqureeComponent } from '../marquree/marquree.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-penal',
  standalone: true,
  imports: [MarqureeComponent, HeaderComponent],
  templateUrl: './penal.component.html',
  styleUrl: './penal.component.scss'
})
export class PenalComponent {

   goBack() {
    window.history.back();
  }
}
