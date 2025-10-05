import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NgFor, NgIf, NgStyle, CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgIf, NgFor, NgStyle],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportsComponent {
  transactions = [
    {
      type: 'Win',
      date: '2025-03-31 18:03:14',
      status: 'SUCCEED',
      color: '#00D457',
      openingBalance: 500,
      winAmount: 500,
      quantity: 10000,
      amountAfterTax: 2000,
      tax: 10000,
      openSelect: ['1X50'],
      result: { number: '999', type1: '88', type2: '777' },
      closingBalance: 10000,
      winLoss: 500,
      active: false,
    },
    {
      type: 'Add Money',
      date: '2025-03-31 18:03:14',
      status: 'SUCCEED',
      color: '#FEAA57',
      openingBalance: 500,
      purchaseAmount: 500,
      amountAfterTax: 2000,
      tax: 10000,
      closingBalance: 10000,
      winLoss: 500,
      active: false,
    },
    {
      type: 'Playing',
      date: '2025-03-31 18:03:14',
      status: 'SUCCEED',
      color: '#57A6FE',
      openingBalance: 500,
      playingAmount: 500,
      amountAfterTax: 2000,
      tax: 10000,
      openSelect: ['1X50', '4X150', '9X200'],
      closingBalance: 10000,
      winLoss: 500,
      active: false,
    },
  ];
}
