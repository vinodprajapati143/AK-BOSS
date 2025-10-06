import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../core/services/wallet.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  userWalletBalance: number | undefined;

  constructor(private router: Router,private walletService:WalletService) {}

  ngOnInit() {
  this.walletService.walletBalance$.subscribe(balance => {
    this.userWalletBalance = balance;
  });
}

  openWallet() {
     this.router.navigate(['/user/add-amount']);
  }

   openProfile() {
     this.router.navigate(['/user/profile']);
  }

  openDashboard() {
     this.router.navigate(['/user/dashboard']);
  }
}
