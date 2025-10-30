import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import {
  NgFor,
  NgIf,
  NgStyle,
  CommonModule,
  DatePipe,
  TitleCasePipe,
} from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    NgIf,
    NgFor,
    NgStyle,
    DatePipe,
    TitleCasePipe,
    LoaderComponent,
    CommonModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportsComponent implements OnInit, AfterViewInit {
  router = inject(Router);
  reportservice = inject(ApiService);
  isLoading = false;
  error: string | null = null;
  transactions = [
    {
      type: 'Balance Transfer',
      route: '/add-amount',
      date: '2025-03-31 18:03:14',
      status: 'SUCCEED',
      color: '#9E161C',
      openingBalance: 500,
      purchaseAmount: 500,
      amountAfterTax: 2000,
      tax: 10000,
      openSelect: ['1X50', '4X150', '9X200'],
      closingBalance: 10000,
      winLoss: 500,
      active: false,
    },
  ];
  playingrecords: any;
  winrecords: any;
  withdrawals: any;
  addMoneyList: any;
  mergedTransactions: any[] | undefined;

ngOnInit() {
  this.isLoading = true;

  let completed = 0;
  const totalRequests = 4;

  const checkDone = () => {
    completed++;
    if (completed === totalRequests) {
      this.isLoading = false;
    }
  };

  this.reportservice.getAllPlayingRecords().subscribe({
    next: (data) => {
      this.playingrecords = data;
      this.checkAndMerge();
      checkDone();
    },
    error: () => checkDone(),
  });

  this.reportservice.getAllWinRecords().subscribe({
    next: (data) => {
      this.winrecords = data;
      this.checkAndMerge();
      checkDone();
    },
    error: () => checkDone(),
  });

  this.reportservice.getWithdrawalsWithBalance().subscribe({
    next: (list) => {
      this.withdrawals = list;
      this.checkAndMerge();
      checkDone();
    },
    error: () => checkDone(),
  });

  this.reportservice.getAddMoneyList().subscribe({
    next: (data) => {
      this.addMoneyList = data;
      this.checkAndMerge();
      checkDone();
    },
    error: () => checkDone(),
  });
}


  ngAfterViewInit(): void {
    // this.mergerArray()
  }

  mergerArray() {
    if (
      this.playingrecords &&
      this.winrecords &&
      this.withdrawals &&
      this.addMoneyList
    ) {
      const allTxns: any[] = [
        ...this.playingrecords.map((txn: { created_at: any }) => ({
          ...txn,
          txn_type: 'playing',
          txn_time: txn.created_at,
        })),
        ...this.winrecords.map((txn: { result_updated_at: any }) => ({
          ...txn,
          txn_type: 'win',
          txn_time: txn.result_updated_at,
        })),
        ...this.withdrawals.map((txn: { requested_at: any }) => ({
          ...txn,
          txn_type: 'withdrawal',
          txn_time: txn.requested_at,
        })),
        ...this.addMoneyList.map((txn: { added_at: any }) => ({
          ...txn,
          txn_type: 'addmoney',
          txn_time: txn.added_at,
        })),
      ];

      // Sort by txn_time descending (newest on top)
      allTxns.sort(
        (a, b) =>
          new Date(b.txn_time).getTime() - new Date(a.txn_time).getTime()
      );

      this.mergedTransactions = allTxns;
      console.log('this.mergedTransactions: ', this.mergedTransactions);
    }
  }

  checkAndMerge() {
    if (
      this.playingrecords &&
      this.winrecords &&
      this.withdrawals &&
      this.addMoneyList
    ) {
      this.mergerArray();
    }
  }
  resolveTxnLabel(type: string) {
    return type === 'win'
      ? 'Win'
      : type === 'addmoney'
        ? 'Add Money'
        : type === 'withdrawal'
          ? 'Withdrawal'
          : type === 'playing'
            ? 'Playing'
            : '';
  }

  getMatchingSelection(transaction: any) {
    // Only filter selections for WIN status
    if (transaction.status === 'WIN') {
      let matchValue = null;

      if (transaction.game_type === 'single_ank') {
        // Use close digit
        matchValue = transaction.result[2]?.toString();
      } else if (transaction.game_type === 'jodi_ank') {
        // Use jodi digits combination, e.g. "11"
        matchValue =
          transaction.result[1]?.toString() + transaction.result[2]?.toString();
      } else if (transaction.game_type === 'singlepanna_ank') {
        // Use panna number, e.g. "109"
        matchValue = transaction.result[0]?.toString();
      } else {
        // Other win cases: show all
        return transaction.selections;
      }

      // Filter only the winning selection(s)
      return transaction.selections.filter((sel: string) =>
        sel.startsWith(matchValue + ' X ')
      );
    }

    // For any NON-WIN (FAILED/SUCCEED/other): Show all selections
    return transaction.selections;
  }

  getSelectLabel(entryType: string, game_time_type: string): string {
    switch (entryType) {
      case 'single_ank':
        return `${game_time_type} Select`;
      case 'jodi_ank':
        return 'Jodi Select';
      case 'singlepanna_ank':
        return `${game_time_type} Select`;

      // Add more cases if needed
      default:
        return 'Select';
    }
  }
}
