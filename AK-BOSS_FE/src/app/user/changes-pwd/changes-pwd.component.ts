import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-changes-pwd',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './changes-pwd.component.html',
  styleUrl: './changes-pwd.component.scss'
})
export class ChangesPwdComponent {

}
