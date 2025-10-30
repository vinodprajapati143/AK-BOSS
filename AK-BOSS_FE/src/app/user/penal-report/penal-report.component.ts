import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';
import { FloatingButtonsComponent } from "../../shared/floating-buttons/floating-buttons.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { PanelRecord } from '../../core/module/models';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-penal-report',
  standalone: true,
  imports: [MarqureeComponent, HeaderComponent, LoaderComponent, FloatingButtonsComponent, CommonModule],
  templateUrl: './penal-report.component.html',
  styleUrl: './penal-report.component.scss'
})
export class PenalReportComponent {
  router = inject(Router);
  isLoading : boolean = false;
  route = inject(ActivatedRoute)
  apiService = inject(ApiService)
  selectedGameId: any;
  fromDate: any;
  toDate: any;
  records: PanelRecord[] | undefined;
  game_name: any;
  result: any;
  weekCells: any;
  weekRows: any;
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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
  ngOnInit() {
    this.isLoading = true;

    this.route.queryParamMap.subscribe(queryParams => {
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 6); // 7 days (today + past 6)

      this.fromDate = this.formatDate(oneWeekAgo);
      this.toDate = this.formatDate(today);
      this.selectedGameId = queryParams.get('gameId');

      this.loadPanelRecords();
    });
  }

  loadPanelRecords() {
    this.isLoading = true;

    this.apiService.getPanelRecords(this.selectedGameId, this.fromDate, this.toDate)
      .subscribe({
        next: (data) => {
          this.records = data.records;
          this.game_name = data.game_name;
          this.result = data.latestResultString;

          // Step 1: Find earliest and latest dates
          const datesList = this.records.map(r => r.input_date).sort();
          const earliestDateStr = datesList[0];
          const latestDateStr = datesList[datesList.length - 1];

          // Step 2: Get Monday for earliest date
          const weekStart = this.getMonday(earliestDateStr);

          // Step 3: Build day-wise records
          const weekCells = [];
          let currentDate = new Date(weekStart);

          while (this.formatDate(currentDate) <= latestDateStr) {
            const dateStr = this.formatDate(currentDate);
            const rec = this.records.find(r => r.input_date === dateStr);

            weekCells.push({
              day: this.getDayName(currentDate),
              date: dateStr,
              jodi_value: rec ? rec.jodi : '**',
              panelLeft: rec ? rec.panelLeft : ["*", "*", "*"],
              panelRight: rec ? rec.panelRight : ["*", "*", "*"]
            });

            currentDate.setDate(currentDate.getDate() + 1);
          }

          this.weekCells = weekCells;
          this.weekRows = this.chunkArray(this.weekCells, 7);
          this.isLoading = false; // ✅ Stop loader after success
        },
        error: (err) => {
          console.error('Error loading panel records:', err);
          this.isLoading = false; // ✅ Stop loader even if error
        }
      });
  }

  refresh() {
    this.isLoading = true;
    this.loadPanelRecords(); // ✅ reload data instead of reloading page
  }
  goBack() {
    this.router.navigate(['/user/home']);
  }


  scrollTo(target: string) {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
