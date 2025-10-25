import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../shared/admin/admin-sidebar/admin-sidebar.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-bal-withdrawal',
  standalone: true,
  imports: [AdminSidebarComponent, NgFor],
  templateUrl: './bal-withdrawal.component.html',
  styleUrl: './bal-withdrawal.component.scss',
})
export class BalWithdrawalComponent {
  users = [
    {
      id: 1,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 2,
      name: 'Vijay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 3,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 4,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 5,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 6,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 7,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 8,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 9,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
    {
      id: 10,
      name: 'Ajay',
      requestdate: '2025-10-25',
      paymentdate: '2025-10-25',
      bank: 'HDFC BANK',
      method: 'UPI / BARCODE',
      amount: '5,000.00',
      utr: '8525822',
      status: 'pending',
      paymentype: 'Manual',
      action: 'Update'
    },
  ];
}
