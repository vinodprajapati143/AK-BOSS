import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editgame-module',
  standalone: true,
  imports: [],
  templateUrl: './editgame-module.component.html',
  styleUrl: './editgame-module.component.scss'
})
export class EditgameModuleComponent {

   constructor(private dialogRef: MatDialogRef<EditgameModuleComponent>) {}
  
    closePopup() {
    this.dialogRef.close();
  }
}
