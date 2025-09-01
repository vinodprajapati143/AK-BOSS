import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';
import { FloatingButtonsComponent } from "../../shared/floating-buttons/floating-buttons.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';


@Component({
  selector: 'app-chart-report',
  standalone: true,
  imports: [MarqureeComponent, CommonModule, HeaderComponent, FloatingButtonsComponent],
  templateUrl: './chart-report.component.html',
  styleUrl: './chart-report.component.scss'
})
export class ChartReportComponent {
  router = inject(Router);
  route = inject(ActivatedRoute)
  apiService = inject(ApiService)
  selectedGameId: any;
  fromDate: any;
  toDate: any;
  records: import("e:/Dheerendra/AK-BOSS/AK-BOSS_FE/src/app/core/module/models").JodiRecord[] | undefined;
  game_name: any;
  result: any;
  weekCells: any;
  weekRows: any;
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

   goBack() {
    this.router.navigate(['/user/home']);
  }

    scrollTo(target: string) {
  const element = document.getElementById(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

ngOnInit() {
 

  // Ya agar query params use kiye to:
  this.route.queryParamMap.subscribe(queryParams => {
      const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 6); // Include today + past 6 days = 7 days

  this.fromDate = this.formatDate(oneWeekAgo);
  this.toDate = this.formatDate(today);
  this.selectedGameId = queryParams.get('gameId');

  this.loadJodiRecords();
    // Use gameId
  });
}

formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

getMonday(dateStr: string): Date {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0=Sun, 1=Mon,...6=Sat
  const diff = (day === 0 ? -6 : 1) - day; // Calculate offset to Monday
  date.setDate(date.getDate() + diff);
  return date;
}

 getDayName(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

chunkArray(arr: any[], chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

loadJodiRecords() {
  this.apiService.getJodiRecords(this.selectedGameId, this.fromDate, this.toDate)
    .subscribe(data => {
      this.records = data.records;
      this.game_name = data.game_name
      this.result = data.result
 // Step 1: Find earliest and latest dates from records
      const datesList = this.records.map(r => r.input_date).sort();
      const earliestDateStr = datesList[0];
      const latestDateStr = datesList[datesList.length - 1];

      // Step 2: Get Monday for earliest date
      const weekStart = this.getMonday(earliestDateStr);

      // Step 3: Build days from Monday till latest date (inclusive)
      const weekCells = [];
      let currentDate = new Date(weekStart);

      while (this.formatDate(currentDate) <= latestDateStr) {
        const dateStr = this.formatDate(currentDate);

        // Find record for this date or ** if missing
        const rec = this.records.find(r => r.input_date === dateStr);
        weekCells.push({
          day: this.getDayName(currentDate),
          date: dateStr,
          jodi_value: rec ? rec.jodi_value : '**'
        });

        // increment one day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.weekCells = weekCells;
      this.weekRows = this.chunkArray(this.weekCells, 7);
      console.log(this.weekCells);
}
    )}
 


}
