import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { WalletService } from '../../core/services/wallet.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-add-amount',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,FormsModule,CommonModule],
  templateUrl: './add-amount.component.html',
  styleUrl: './add-amount.component.scss'
})
export class AddAmountComponent implements OnInit {
    amount: number = 0; // for bound input
  userdata: any;
  walletblance: any;

  constructor(
    private walletService: WalletService,
    private apiservice:ApiService,
    private toastr: ToastrService
  ) {}

    ngOnInit(): void {

    this.getuseerandwalletbalnce()


  }

    getuseerandwalletbalnce(){
    this.apiservice.userSubject.subscribe((val:any)=>{
      this.userdata = val
    })

    this.walletService.walletBalance$.subscribe((val:any)=>{
      this.walletblance = val

    })
  }

  setQuickAmount(val: number) {
    this.amount = val;
  }

   submitAddAmount() {
    if (!this.amount || this.amount < 1) {
      this.toastr.error('Minimum amount is ₹1');
      return;
    }
    this.walletService.createAddMoneyOrder(this.amount).subscribe({
      next: (res) => {
        if (res.success && res.payment_url) {
          window.location.href = res.payment_url; // LIVE gateway redirect
        } else {
          this.toastr.error(res.message || "Could not start payment");
        }
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || "Network/server error");
      }
    });
  }

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

  navigateToWithdrawal() {
    window.location.href = '/user/withdrawal';
  }
}
