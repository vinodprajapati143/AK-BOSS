import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './core/services/api.service';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'AK-BOSS';
  user: any;
 sessionStorageService = inject(StorageService);
  

   constructor(private router: Router, private strorageservice: StorageService, private toaster: ToastrService, private backendservice: ApiService) {
  
    }

  ngOnInit(): void {
  const LoggedIN = this.sessionStorageService.getItem('authToken'); // Example: Retrieve from localStorage
      if(LoggedIN){
        this.getUserDetails();

      }
  }

    getUserDetails() {
    this.backendservice.getUserProfile().subscribe({
      next: (res:any) => {
        if (res.success) {
          this.user = res.data[0]; // 👈 yaha sari detail aayegi
          this.backendservice.userSubject.next(res.data);
        }
      },
      error: (err) => {
        console.error('Profile fetch error:', err);
      }
    });
  }

}
