import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../core/services/api.service';
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  user: any;

 constructor(private router: Router, private strorageservice: StorageService, private toaster: ToastrService, private backendservice: ApiService) {

  }
     logout() {
    this.backendservice.logout({}).subscribe({
      next: (res: any) => {
        this.toaster.success(res.message);
        this.strorageservice.removeItem('authToken');
        this.strorageservice.clear();
        this.strorageservice.clearCookies();


        this.router.navigate(['/user/home']);
      },
      error: err => {
        console.error('Logout failed:', err);
        this.strorageservice.removeItem('authToken');
        // this.router.navigate(['/home']);
      }
    });
  }

    ngOnInit(): void {
    this.getUserDetails();
  }

  gameRate() {
    this.router.navigate(['/user/game-rate']);
  }

  chatSupport() {
    const phoneNumber = "919575259525";
    const message = "Hello, I need assistance!";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  closeWhatsApp() {
    const url = `https://wa.me/919575259525?text=Goodbye`;
    window.open(url, "_blank");
  }

  howToPlay() {
    this.router.navigate(['/user/how-to-play']);
  }

  contactAdmin() {
    this.router.navigate(['/user/contact-admin']);
  }

  changePassword() {
    this.router.navigate(['/user/change-password']);
  }

  editUserName() {
    this.router.navigate(['/user/editUserName']);
  }
  getUserDetails() {
    this.backendservice.getUserProfile().subscribe({
      next: (res:any) => {
        if (res.success) {
          this.user = res.data[0]; // 👈 yaha sari detail aayegi
        }
      },
      error: (err) => {
        console.error('Profile fetch error:', err);
      }
    });
  }
}
