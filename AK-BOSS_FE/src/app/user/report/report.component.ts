import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgIf, NgFor],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportsComponent {
  transactions = [
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500,
      active:true
    },
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500
    },
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500
    },
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500
    },
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500
    },
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500
    },
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500
    },
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500
    },
    {
      date: '2025-03-31',
      openingBalance: 500,
      purchaseAmount: 500,
      quantity: 100,
      amountAfterTax: 2000,
      tax: 20,
      result: { number: 4, type1: 'SMALL', type2: 'RED' },
      select: 'SMALL',
      status: 'SUCCESS',
      winLoss: 500,
      closingBalance: 500
    },
  ]
}
