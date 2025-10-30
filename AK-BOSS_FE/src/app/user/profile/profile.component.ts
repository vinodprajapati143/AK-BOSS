import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../core/services/api.service';
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangepwdModalComponent } from '../changepwd-modal/changepwd-modal.component';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private strorageservice: StorageService,
    private toaster: ToastrService,
    private backendservice: ApiService
  ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

   getUserDetails() {
    this.isLoading = true; // start loader
    this.backendservice.getUserProfile().subscribe({
      next: (res: any) => {
        this.isLoading = false; // stop loader
        if (res.success) {
          this.user = res.data;
          this.backendservice.userSubject.next(res.data);
        }
      },
      error: (err) => {
        console.error('Profile fetch error:', err);
        this.isLoading = false; // stop loader on error
      },
    });
  }

  // ✅ Logout with loader
  logout() {
    this.isLoading = true; // start loader
    this.backendservice.logout({}).subscribe({
      next: (res: any) => {
        this.isLoading = false; // stop loader
        this.toaster.success(res.message);
        this.strorageservice.removeItem('authToken');
        this.strorageservice.clear();
        this.strorageservice.clearCookies();
        this.router.navigate(['/user/home']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.isLoading = false; // stop loader even if error
        this.strorageservice.removeItem('authToken');
      },
    });
  }

  gameRate() {
    this.router.navigate(['/user/game-rate']);
  }

  chatSupport() {
    const phoneNumber = '919575259525';
    const message = 'Hello, I need assistance!';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  closeWhatsApp() {
    const url = `https://wa.me/919575259525?text=Goodbye`;
    window.open(url, '_blank');
  }

  howToPlay() {
    this.router.navigate(['/user/how-to-play']);
  }

  contactAdmin() {
    this.router.navigate(['/user/contact-admin']);
  }

  changePassword() {
    this.dialog.open(ChangepwdModalComponent, {
      width: '400px',
      panelClass: 'custom-dialog',
    });
  }

  editUserName() {
    this.dialog.open(ProfileEditComponent, {
      width: '400px',
      panelClass: 'custom-dialog',
    });
    
  }
}
