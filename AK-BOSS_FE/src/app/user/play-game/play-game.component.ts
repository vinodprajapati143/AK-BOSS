import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-play-game',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, FormsModule],
  templateUrl: './play-game.component.html',
  styleUrl: './play-game.component.scss'
})
export class PlayGameComponent {
  date: Date = new Date();
   digit: number | null = null;
  amount: number | null = null;
  numbers: { digit: number; amount: number }[] = [];
  totalAmount = 0;

  addNumber() {
    if (this.digit && this.amount) {
      this.numbers.push({ digit: this.digit, amount: this.amount });
      this.calculateTotal();
      this.digit = null;
      this.amount = null;
    }
  }

  removeNumber(index: number) {
    this.numbers.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.numbers.reduce((sum, item) => sum + item.amount, 0);
  }
}
