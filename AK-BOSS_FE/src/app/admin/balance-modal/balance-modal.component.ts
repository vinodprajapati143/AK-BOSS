import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-balance-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './balance-modal.component.html',
  styleUrl: './balance-modal.component.scss'
})
export class BalanceModalComponent {
  dialogRef = inject(MatDialogRef<BalanceModalComponent>);

    showModal = false;

  // Mock data
  userName = 'laxman singh';
  mobileNumber = '9460516066';
  currentBalance = 575.10;

  // Form fields
  remark = '';
  amount: number | null = null;
  confirmAmount: number | null = null;
  password = '';

  openModal() {
    this.showModal = true;
  }

 closeModal() {
  this.dialogRef.close();
}

  submitForm(event: Event) {
    event.preventDefault();
    if (this.amount !== this.confirmAmount) {
      alert('Amounts do not match!');
      return;
    }

    // Handle transfer logic here
    alert(`Transferring ₹${this.amount} to ${this.userName}`);
    this.closeModal();
  }
}
