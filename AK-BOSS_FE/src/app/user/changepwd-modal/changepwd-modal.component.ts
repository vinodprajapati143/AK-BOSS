import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-changepwd-modal',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './changepwd-modal.component.html',
  styleUrl: './changepwd-modal.component.scss'
})
export class ChangepwdModalComponent {

 constructor(private dialogRef: MatDialogRef<ChangepwdModalComponent>) {}

  closeModal() {
  this.dialogRef.close();
}

}
