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

  this.loadJodiRecords();
    this.selectedGameId = queryParams.get('gameId');
    // Use gameId
  });
}

 formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

loadJodiRecords() {
  this.apiService.getJodiRecords(this.selectedGameId, this.fromDate, this.toDate)
    .subscribe(data => {
      this.records = data.records;
      this.populateTable();
    });
}
  populateTable() {
    throw new Error('Method not implemented.');
  }


}
