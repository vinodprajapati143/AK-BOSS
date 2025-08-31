import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgFor } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-share-page',
  standalone: true,
  imports: [HeaderComponent, NgFor, FooterComponent],
  templateUrl: './share-page.component.html',
  styleUrl: './share-page.component.scss'
})
export class SharePageComponent {
 referralList = [
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 },
    { inviteCode: '12345***', bidAmount: 500, commission: 70 }
  ];
}
