import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgFor } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-share-page',
  standalone: true,
  imports: [HeaderComponent, NgFor, FooterComponent],
  templateUrl: './share-page.component.html',
  styleUrl: './share-page.component.scss'
})
export class SharePageComponent {
  apiService = inject(ApiService)
 referralList = [
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 }
  ];

  inviteLink: string = '';
  ngOnInit() {
  this.apiService.getReferralCode().subscribe({
    next: (res: any) => {
      console.log('res: ', res);
      if (res && res.inviteCode) {
        this.inviteLink = `https://yourapp.com/register?ref=${res.inviteCode}`;
      }
    },
    error: (err) => {
      console.error('Failed to get referral code', err);
    }
  });
}
}
