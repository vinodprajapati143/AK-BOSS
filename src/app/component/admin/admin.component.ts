import { Component } from '@angular/core';
import { FooterComponent } from "../../pages/footer/footer.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
