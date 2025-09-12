import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-display.component.html',
  styleUrl: './game-display.component.scss'
})
export class GameDisplayComponent {
  @Input() gameName: string = 'GAGAN DAY';
  @Input() stars: string[] = ['★', '★', '★', '-', '★', '★', '-', '★', '★', '★']; // example array with stars and dashes
  @Input() openHH :any;
  @Input() openMM :any;
  @Input() opensSS:any;
  @Input() closeHH :any;
  @Input() closeMM :any;
  @Input() closesSS :any;

  




}
