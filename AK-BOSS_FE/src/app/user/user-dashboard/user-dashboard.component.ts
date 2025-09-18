import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Game, UserGame } from '../../core/module/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FooterComponent, HeaderComponent,CommonModule,FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit{
  router = inject(Router);
  gameService = inject(ApiService);

    games: UserGame[] = [];
  loading = true;

  openWhatsApp() {
    const phoneNumber = "919575259525";
    const message = "Hello, I need assistance!";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  closeWhatsApp() {
    const url = `https://wa.me/919575259525?text=Goodbye`;
    window.open(url, "_blank");
  }

  openChart() {
    this.router.navigate(['/user/share-page']);
  }

    ngOnInit(): void {
    this.gameService.getUserGames().subscribe({
      next: (res) => {
        if (res.success) {
          this.games = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.loading = false;
      }
    });
  }
  playGame() {
    this.router.navigate(['/user/all-games']);
  }
}
