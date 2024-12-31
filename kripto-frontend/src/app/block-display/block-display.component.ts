import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule} from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-block-display',
  imports:[CommonModule, MatButtonModule, MatDividerModule, MatExpansionModule, MatCardModule],
  templateUrl: './block-display.component.html',
  styleUrls: ['./block-display.component.css']
})
export class BlockDisplayComponent implements OnInit {
  block: any;
  paginatedTx: string[] = [];
  pageSize = 20;
  currentPage = 0;

  baseUrl: string = 'http://localhost:8080';

  constructor(private route: ActivatedRoute, private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const selectedBlockchain = params['selectedBlockchain'];
      const searchQuery = params['searchQuery']
      this.fetchBlockData(selectedBlockchain, searchQuery);
    });
  }

  fetchBlockData(selectedBlockchain: string, searchQuery: string) {
    const apiUrl = `${this.baseUrl}/api/blockchain/search?query=${searchQuery}&blockchain=${selectedBlockchain}`;
    this.http.get(apiUrl).subscribe({
      next: (data:any) => {
        this.block = data;
        console.log("Block in block-display",this.block)
        this.resetPagination();
      },
      error: (err) => {
        console.error('Failed to fetch block data:', err);
      },
    });
  }

  resetPagination() {
    this.currentPage = 0;
    this.paginatedTx = this.block.tx.slice(0, this.pageSize);
  }

  loadMoreTx() {
    this.currentPage++;
    const nextBatch = this.block.tx.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
    this.paginatedTx = [...this.paginatedTx, ...nextBatch];
  }

  copyToClipboard(txid: string) {
    navigator.clipboard.writeText(txid).then(() => {
      this.snackBar.open('Transaction ID copied to clipboard!', 'Close', {
        duration: 3000,
      });
    });
  }
}