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
  @Input() timer = { hours: '02', minutes: '35', seconds: '45' };
}
