import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-withdrawal',
  standalone: true,
  imports: [HeaderComponent ,FooterComponent],
  templateUrl: './withdrawal.component.html',
  styleUrl: './withdrawal.component.scss'
})
export class WithdrawalComponent {

  openWhatsApp() {
    const phoneNumber = "918979108932";
    const message = "Hello, I need assistance!";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  closeWhatsApp() {
    const url = `https://wa.me/918979108932?text=Goodbye`;
    window.open(url, "_blank");
  }
}
