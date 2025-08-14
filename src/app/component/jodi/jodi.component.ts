import { Component } from '@angular/core';
import { MarqureeComponent } from '../marquree/marquree.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-jodi',
  standalone: true,
  imports: [MarqureeComponent, CommonModule, HeaderComponent],
  templateUrl: './jodi.component.html',
  styleUrl: './jodi.component.scss'
})
export class JodiComponent {

  goBack() {
    window.history.back();
  }
}
