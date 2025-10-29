import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-withdrawal-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './withdrawal-modal.component.html',
  styleUrls: ['./withdrawal-modal.component.scss']
})
export class WithdrawalModalComponent {
  dialogRef = inject(MatDialogRef<WithdrawalModalComponent>);
  withdrawForm!: FormGroup
   isProcessing = false;
  message = '';
  constructor(
    private fb: FormBuilder,
    private apiservice:ApiService,
    private toastr:ToastrService,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

   ngOnInit() {
      const utcDate = this.user?.requested_at;
  const istDate = utcDate
    ? new Date(utcDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : '';
    this.withdrawForm = this.fb.group({
      // User info
      user_id: [ this.user?.user_id ],

      name: [{ value: this.user?.user_name || '', disabled: true }],
      paymentDate: [{ value: istDate || '', disabled: true }],
      method: [{ value: this.user?.payment_method || '', disabled: true }],

      // UPI fields (conditionally shown)
      upi_phone_number: [{ value: this.user?.phone_number || '', disabled: true }],
      upi_account_holder_name: [{ value: this.user?.account_holder_name || '', disabled: true }],
      upi_id: [{ value: this.user?.upi_id || '', disabled: true }],

      // Bank fields (conditionally shown)
      bank_phone_number: [{ value: this.user?.phone_number || '', disabled: true }],
      bank_account_holder_name: [{ value: this.user?.bank_account_holder_name || '', disabled: true }],
      bank_name: [{ value: this.user?.bank_name || '', disabled: true }],
      bank_account_number: [{ value: this.user?.bank_account_number || '', disabled: true }],
      bank_ifsc_code: [{ value: this.user?.bank_ifsc_code || '', disabled: true }],

      // Rest fields
      amount: [{ value: this.user?.amount || '', disabled: true }],
      remark: [''],
      password: [''],
      action: ['Success']
    });
  }

  
onSubmit() {
  if (
    this.withdrawForm.value.password &&
    this.withdrawForm.value.remark &&
    this.withdrawForm.value.action
  ) {
    // All required fields are filled, proceed as normal
    this.isProcessing = true;
    const payload = {
      user_id: this.user.user_id,
      amount: this.user.amount,
      action: this.withdrawForm.value.action,
      remark: this.withdrawForm.value.remark,
      password: this.withdrawForm.value.password
    };
    this.apiservice.processWithdrawalRequest(payload).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.message = res.message || 'Success';
        this.toastr.success(this.message)
        setTimeout(() => this.dialogRef.close(true), 1000);
      },
      error: (err) => {
        this.isProcessing = false;
        this.message = err.error?.message || 'Failed to process request';
        this.toastr.error(this.message)

      }
    });
  } else {
    // At least one field is missing, show error
    this.message = 'Please fill all required fields: Password, Remark, Action.';
  }
}

  closeModal() {
    this.dialogRef.close();
  }

}
