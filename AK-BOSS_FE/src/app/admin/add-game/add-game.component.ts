import { Component } from '@angular/core';
import { AdminSidebarComponent } from "../../shared/admin/admin-sidebar/admin-sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [AdminSidebarComponent, CommonModule],
  templateUrl: './add-game.component.html',
  styleUrl: './add-game.component.scss'
})
export class AddGameComponent {
  addGamePopupOpen: boolean = false;
  togglePopup() {
    this.addGamePopupOpen = !this.addGamePopupOpen;
  }
}
