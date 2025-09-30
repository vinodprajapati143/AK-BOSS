import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-changepwd-modal',
  standalone: true,
  imports: [],
  templateUrl: './changepwd-modal.component.html',
  styleUrl: './changepwd-modal.component.scss'
})
export class ChangepwdModalComponent {

 constructor(private dialogRef: MatDialogRef<ChangepwdModalComponent>) {}

  closeModal() {
  this.dialogRef.close();
}

}
