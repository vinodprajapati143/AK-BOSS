import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamedataService } from '../../core/services/gamedata.service';
import { ApiService } from '../../core/services/api.service';
import { WalletService } from '../../core/services/wallet.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play-game',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, FormsModule],
  templateUrl: './play-game.component.html',
  styleUrl: './play-game.component.scss'
})
export class PlayGameComponent implements OnInit {
  @Input() game: any;
  @Output() backClicked = new EventEmitter<void>();
  date: Date = new Date();
  digit: number | null = null;
  amount: number | null = null;
  numbers: { digit: number; amount: number }[] = [];
  totalAmount = 0;
  gameDataService = inject(GamedataService);
  apiservice = inject(ApiService);
  walletService = inject(WalletService);
  location = inject(Location);
  toastr = inject(ToastrService);
  router = inject(Router);
  selectedGameTimeType: any;




  ngOnInit() {
    this.gameDataService.getGameData().subscribe(game => {
      if (game) {
        this.game = game;
        console.log('this.game: ', this.game);
        // Setup UI accordingly
      } else {
        // Redirect or show message
        // this.router.navigate(['/user/all-games']);
      }
    });
  }

  addNumber() {
    if (this.digit !== null && this.amount !== null) {
      this.numbers.push({ digit: this.digit, amount: this.amount });
      this.calculateTotal();
      this.digit = null;
      this.amount = null;
    }
  }


  calculateTotal() {
    this.totalAmount = this.numbers.reduce((sum, item) => sum + Number(item.amount), 0);
  }

  removeNumber(index: number) {
    this.numbers.splice(index, 1);
    this.calculateTotal();
  }

  submit() {

    const todayDate = new Date().toISOString().split('T')[0];
    console.log('todayDate: ', todayDate);


    const payload = {

      game_id: this.game.id,
      input_date: todayDate,
      name: this.game.name,
      total_amount: this.totalAmount,
      entrytype: this.game.entrytype,
      game_time_type: this.selectedGameTimeType,
      entries: this.numbers.map(item => ({
        digit: Number(item.digit),
        amount: item.amount
      }))
    };

    console.log("Payload for submission:", payload);

switch(this.game.entrytype) {
    case 'singleank':
      this.apiservice.saveEntries(payload, 'single').subscribe({
        next: (response) => {
          console.log('Single Ank saved', response);
          this.handleSuccess(response);
        },
        error: (err) => {
          console.error('Error saving Single Ank', err);
          this.handleError(err);
        }
      });
      break;

    case 'jodi':
      this.apiservice.saveEntries(payload, 'jodi').subscribe({
        next: (response) => {
          console.log('Jodi saved', response);
          this.handleSuccess(response);
        },
        error: (err) => {
          console.error('Error saving Jodi', err);
          this.handleError(err);
        }
      });
      break;

    // Add cases for other entry types following similar structure
    // Note: Make sure backend API and service support these

    default:
      console.warn('Unsupported entry type:', this.game.entrytype);
      break;
  }



    // yahan aap HTTP call karke payload backend ko send kar sakte hain
  }
    handleSuccess(response: any) {
  this.toastr.success(response.message);
  this.walletService.refreshWallet();
  this.router.navigate(['/user/report']);
}

handleError(err: any) {
  this.toastr.error(err.message || 'Error occurred');
}
  back() {
    this.location.back();
  }
}
