import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
   private baseUrl = environment.apiUrl;
  
  private walletBalanceSubject = new BehaviorSubject<number>(0);
  walletBalance$ = this.walletBalanceSubject.asObservable();

  constructor(private http: HttpClient) {
    // Automatically poll wallet balance every 30 seconds
    timer(0, 30000).pipe(
      switchMap(() => this.fetchWalletBalance())
    ).subscribe(balance => this.walletBalanceSubject.next(balance));
  }

  private fetchWalletBalance() {
    return this.http.get<{balance: number}>(`${this.baseUrl}/api/wallet/balance`).pipe(
      switchMap(response => [response.balance])
    );
  }

  // Optional: Manual refresh if needed
  refreshWallet() {
    this.fetchWalletBalance().subscribe(balance => this.walletBalanceSubject.next(balance));
  }
}
