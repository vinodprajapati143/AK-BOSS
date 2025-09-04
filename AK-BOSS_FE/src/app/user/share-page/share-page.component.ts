import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { isPlatformBrowser, NgFor } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ApiService } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-share-page',
  standalone: true,
  imports: [HeaderComponent, NgFor, FooterComponent],
  templateUrl: './share-page.component.html',
  styleUrl: './share-page.component.scss'
})
export class SharePageComponent {
  apiService = inject(ApiService)
  toastr = inject(ToastrService)
  platformId = inject(PLATFORM_ID);
  

 referralList = [
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 }
  ];

  inviteLink: string = '';
    getDomainUrl(): string {
      if (isPlatformBrowser(this.platformId)) {
        return window.location.origin;
      }
      return ''; // Server-side ya fallback value
    }
  ngOnInit() {
 
}

referralCode(){
 this.apiService.getReferralCode().subscribe({
    next: (res: any) => {
      if (res && res.inviteCode) {
        this.inviteLink = ` ${this.getDomainUrl()}/auth/register?ref=${res.inviteCode}`;
      }
    },
    error: (err) => {
      console.error('Failed to get referral code', err);
    }
  });
}

referList(){
 this.apiService.getReferralList().subscribe({
    next: (res: any) => {
      console.log('res: ', res);
      // if (res && res.inviteCode) {
      //   this.inviteLink = ` ${this.getDomainUrl()}/auth/register?ref=${res.inviteCode}`;
      // }
    },
    error: (err) => {
      console.error('Failed to get referral code', err);
    }
  });
}


  copyInviteLink() {
    navigator.clipboard.writeText(this.inviteLink)
      .then(() => {
        this.toastr.success('Referral link copied!');
      })
      .catch(() => {
        this.toastr.error('Failed to copy. Please try manually.');
      });
  }

  shareInvite() {
    if (navigator.share) {
      navigator.share({
        title: 'Join AKBOSS',
        text: 'Register using my referral link and earn rewards!',
        url: this.inviteLink,
      }).then(() => {
        this.toastr.success('Sharing options opened!');
      }).catch(() => {
        this.toastr.error('Share cancelled or failed.');
      });
    } else {
      this.toastr.warning('Sharing not supported on this device/browser.');
    }
  }


}
