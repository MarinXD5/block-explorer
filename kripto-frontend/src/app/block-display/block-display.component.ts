import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule} from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionDetailsDialogComponent } from '../transaction-details-dialog/transaction-details-dialog.component';

@Component({
  selector: 'app-block-display',
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatExpansionModule, MatCardModule],
  templateUrl: './block-display.component.html',
  styleUrls: ['./block-display.component.css'],
})
export class BlockDisplayComponent implements OnInit {
  paginatedTx: string[] = [];
  pageSize = 20;
  currentPage = 0;

  blockchainInfo: any;
  selectedBlockchain: string = '';
  transactionDetails: any | null = null;

  baseUrl: string = 'http://localhost:8080';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const blockHash = params['blockHash'];
      if (blockHash) {
        console.log("Ima blockhash");
        this.fetchBlockDetails(blockHash);
      } else {
        console.log("Nema blockhash");
        this.loadBlockFromLocalStorage();
      }
    });
  }

  loadBlockFromLocalStorage() {
    this.blockchainInfo = JSON.parse(localStorage.getItem('blockchainInfo')!);
    this.selectedBlockchain = localStorage.getItem('selectedBlockchain')!;
    if (this.blockchainInfo?.tx?.length) {
      this.resetPagination();
    } else {
      console.warn('No transactions found in blockchainInfo.');
      this.paginatedTx = [];
    }
  }

  fetchBlockDetails(blockHash: string) {
    const apiUrl = `${this.baseUrl}/api/blockchain/search?query=${blockHash}&blockchain=${this.selectedBlockchain}`;
    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        this.blockchainInfo = data.m;
        this.resetPagination();
      },
      error: (err) => {
        console.error('Failed to fetch block details:', err);
        this.snackBar.open('Failed to load block details.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  resetPagination() {
    this.currentPage = 0;
    this.paginatedTx = this.blockchainInfo.tx.slice(0, this.pageSize);
  }

  loadMoreTx() {
    this.currentPage++;
    const nextBatch = this.blockchainInfo.tx.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );
    this.paginatedTx = [...this.paginatedTx, ...nextBatch];
  }

  copyToClipboard(txid: string) {
    navigator.clipboard.writeText(txid).then(() => {
      this.snackBar.open('Transaction ID copied to clipboard!', 'Close', {
        duration: 3000,
      });
    });
  }

  fetchTransactionDetails(txId: string) {
    const apiUrl = `${this.baseUrl}/api/blockchain/transaction?blockchain=${this.selectedBlockchain}&txId=${txId}`;
    this.http.get(apiUrl).subscribe({
      next: (details: any) => {
        this.transactionDetails = details;
        this.openTransactionDialog();
      },
      error: (err) => {
        console.error('Failed to fetch transaction details:', err);
        this.snackBar.open('Failed to load transaction details.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  openTransactionDialog() {
    this.dialog.open(TransactionDetailsDialogComponent, {
      width: '80vw',
      height: '85vh',
      maxWidth: '100vw',
      data: this.transactionDetails,
    });
  }

  navigateToBlock(blockHash: string) {
    const url = `/block/${this.selectedBlockchain}/${blockHash}`;
    this.router.navigate([url]);
    this.fetchBlockDetails(blockHash);
  }
}