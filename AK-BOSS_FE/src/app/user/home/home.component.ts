import { Component } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarqureeComponent } from '../../shared/marquree/marquree.component';
import { FloatingButtonsComponent } from "../../shared/floating-buttons/floating-buttons.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, HeaderComponent, MarqureeComponent, FloatingButtonsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
constructor(private router: Router) {}
   
   chartData = [
    {
      day: 'सोम',
      num: 3,
      blocks: [
        { threeDigit: '689', twoDigit: '35' },
        { threeDigit: '366', twoDigit: '53' },
        { threeDigit: '223', twoDigit: '78' },
        { threeDigit: '666', twoDigit: '87' },
      ]
    },
    {
      day: 'मंगल',
      num: 2,
      blocks: [
        { threeDigit: '156', twoDigit: '27' },
        { threeDigit: '467', twoDigit: '72' },
        { threeDigit: '477', twoDigit: '89' },
        { threeDigit: '333', twoDigit: '98' },
      ] 
    },
    {
      day: 'बुध',
      num: 3,
      blocks: [
        { threeDigit: '779', twoDigit: '37' },
        { threeDigit: '359', twoDigit: '73' },
        { threeDigit: '134', twoDigit: '89' },
        { threeDigit: '478', twoDigit: '98' },
      ]
    },
    {
      day: 'गुरु',
      num: 3,
      blocks: [
        { threeDigit: '779', twoDigit: '35' },
        { threeDigit: '168', twoDigit: '53' },
        { threeDigit: '133', twoDigit: '79' },
        { threeDigit: '388', twoDigit: '97' },
      ]
    },
    {
      day: 'शुक्र',
      num: 5,
      blocks: [
        { threeDigit: '122', twoDigit: '56' },
        { threeDigit: '277', twoDigit: '65' },
        { threeDigit: '269', twoDigit: '78' },
        { threeDigit: '189', twoDigit: '87' },
      ]
    },
    {
      day: 'शनि',
      num: 2,
      blocks: [
        { threeDigit: '138', twoDigit: '25' },
        { threeDigit: '122', twoDigit: '52' },
        { threeDigit: '467', twoDigit: '79' },
        { threeDigit: '234', twoDigit: '97' },
      ]
    },
  ];


    tableData = [
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
    { time1: '09:05 AM', result1: '338-4', time2: '03:05 PM', result2: '338-4' },
  ];

   cards = [
    {
      title: 'Milan Morning',
      type: 'milan',
      line1: '1-6-3-8',
      line2: '119-114-238-288-567',
      line3: '13-18-63-68-31-36-81-86',
    },
    {
      title: 'Kalyan Morning',
      type: 'kalyan',
      line1: '4-9-5-0',
      line2: '257-270-289-140-190',
      line3: '45-40-95-90-54-59-04-09',
    },
    // Repeat as needed
  ];

  openChart() {
    this.router.navigate(['/admin/users']);
  }

   chartReport() {
   this.router.navigate(['/user/chart-report']);
  }

   todayReport() {
    this.router.navigate(['/user/today-report']);
  }
}
