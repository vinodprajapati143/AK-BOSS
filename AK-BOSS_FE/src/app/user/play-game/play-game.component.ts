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
      entries: this.numbers.map(item => ({
        digit: Number(item.digit),
        amount: item.amount
      }))
    };

    console.log("Payload for submission:", payload);

    this.apiservice.saveEntries(payload).subscribe({
      next: (response) => {
        console.log('Entries saved successfully', response);
        this.toastr.success(response.message)
        this.walletService.refreshWallet();
        this.router.navigate(['/user/report'])

        // Yahan pe success ka UI feedback ya navigation kar sakte ho
      },
      error: (err) => {
        console.error('Error saving entries', err);
        this.toastr.success(err.message)

        // Yahan pe error message show karwana
      }
    });

    // yahan aap HTTP call karke payload backend ko send kar sakte hain
  }
  back() {
    this.location.back();
  }
}
