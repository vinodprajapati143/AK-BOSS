import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-withdrawal-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './withdrawal-modal.component.html',
  styleUrls: ['./withdrawal-modal.component.scss']
})
export class WithdrawalModalComponent {
  dialogRef = inject(MatDialogRef<WithdrawalModalComponent>);

  closeModal() {
    this.dialogRef.close();
  }

}
