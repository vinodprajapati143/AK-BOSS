import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,ReactiveFormsModule,FormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit{
  profileForm!: FormGroup;
  user: any;

  constructor(private fb: FormBuilder, private backendService: ApiService,private toastr:ToastrService) {}

    ngOnInit(): void {
    // form banaya
    this.profileForm = this.fb.group({
      username: [''],
      phone: [''],
    });

    // signal se value patch
     this.backendService.user$.subscribe(user => {
      console.log('user: ', user);
      this.user = user
            if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        phone: `${this.user.countryCode}-${this.user.phone}`
      });
    }
      });

  }

saveProfile() {
  if (this.profileForm.valid) {
    const payload = {
      id: this.user.id, // id tu user object se le sakta hai
      username: this.profileForm.value.username,
      phone: this.profileForm.value.phone.split('-')[1],
      countryCode: this.user.countryCode
    };

    this.backendService.updateUserProfile(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log('Profile updated:', res.message);
          this.backendService.getUserProfile();
            this.toastr.success(res.message);

          // optionally form ko patch/update kar sakte ho
        }
      },
      error: (err) => {
        console.error('Update failed:', err);
      }
    });
  }
}

}
