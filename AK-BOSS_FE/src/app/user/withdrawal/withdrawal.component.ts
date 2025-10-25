import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-withdrawal',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './withdrawal.component.html',
  styleUrl: './withdrawal.component.scss'
})
export class WithdrawalComponent {
   withdraw = {
    amount: '',
    mode: '',
    phone: '',
    name: '',
    upiId: '',
    accountNumber: '',
    ifsc: '',
  };

  openWhatsApp() {
    const phoneNumber = "919575259525";
    const message = "Hello, I need assistance!";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  closeWhatsApp() {
    const url = `https://wa.me/919575259525?text=Goodbye`;
    window.open(url, "_blank");
  }

  navigateToAddAmount() {
    window.location.href = '/user/add-amount';
  }

   submitWithdrawal() {
    if (!this.withdraw.amount || +this.withdraw.amount < 1000) {
      alert('Minimum withdrawal amount is ₹1000');
      return;
    }

    if (!this.withdraw.mode) {
      alert('Please select a withdrawal mode');
      return;
    }

    // Mode-specific validation
    if (this.withdraw.mode === 'upi') {
      if (!this.withdraw.name || !this.withdraw.upiId) {
        alert('Please enter your name and UPI ID');
        return;
      }
    }

    if (this.withdraw.mode === 'bank') {
      if (!this.withdraw.name || !this.withdraw.accountNumber || !this.withdraw.ifsc) {
        alert('Please fill all bank details');
        return;
      }
    }

    // ✅ Send data to API or service
    console.log('Withdrawal Request:', this.withdraw);
    alert('Withdrawal request submitted successfully!');
  }
}
