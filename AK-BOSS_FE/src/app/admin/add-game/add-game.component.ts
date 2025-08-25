import { Component } from '@angular/core';
import { AdminSidebarComponent } from "../../shared/admin/admin-sidebar/admin-sidebar.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [AdminSidebarComponent, CommonModule, FormsModule,ReactiveFormsModule,ToastrModule],
  templateUrl: './add-game.component.html',
  styleUrl: './add-game.component.scss'
})
export class AddGameComponent {
  addGamePopupOpen: boolean = false;
  days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  priceList = [
    { gameType: "Single Digit", price: 24000 },
    { gameType: "Jodi Digit", price: 24000 },
    { gameType: "Single Panna", price: 24000 },
    { gameType: "Double Panna", price: 24000 },
    { gameType: "Triple Panna", price: 24000 },
    { gameType: "Half Sangam", price: 24000 },
    { gameType: "Full Sangam", price: 24000 },
  ];
  selectedDays: string[] = [];
  selectAll: boolean = false;
  gameForm: FormGroup;

    constructor(private fb: FormBuilder, private http: HttpClient ,private apiService:ApiService, private toastr:ToastrService) {
    this.gameForm = this.fb.group({
      game_name: [''],
      open_time: [''],
      close_time: [''],
      days: [[]],
      prices:[this.priceList]
      
         // yahan array store hoga
    });
  }


  toggleSelectAll(event: any) {
    this.selectAll = event.target.checked;
    if (this.selectAll) {
      this.selectedDays = [...this.days]; // sare days
    } else {
      this.selectedDays = [];
    }
  }

    toggleDay(day: string, event: any) {
    if (event.target.checked) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }

    // agar sare selected ho gaye to selectAll bhi check kar do
    this.selectAll = this.selectedDays.length === this.days.length;
  }

    saveGame() {
    const payload = this.gameForm.value;
    payload.days = this.selectedDays

    this.apiService.addGame(payload).subscribe({
     next: (res:any) =>{
        this.toastr.success(res.message);
        this.addGamePopupOpen =false;
     },
     error : (err:any) =>{
      this.toastr.success(err.message);
     }
    });
  }
  togglePopup() {
    this.addGamePopupOpen = !this.addGamePopupOpen;
  }
}
