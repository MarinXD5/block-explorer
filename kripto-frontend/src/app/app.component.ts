import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  selectedBlockchain = 'bitcoin_mainnet';
  searchQuery = '';
  blockchainInfo: any = null;
  blockchainData: any = null;
  baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient, private cdf: ChangeDetectorRef, private router: Router) {}

  searchBlockchain() {
    if (this.searchQuery) {
      let apiUrl = '';
      if (this.isBlockHash(this.searchQuery)) {
        apiUrl = `${this.baseUrl}/api/blockchain/search?query=${this.searchQuery}&blockchain=${this.selectedBlockchain}`;
      } else if (this.isTransactionId(this.searchQuery)) {
        apiUrl = `${this.baseUrl}/api/blockchain/transaction?blockchain=${this.selectedBlockchain}&txId=${this.searchQuery}`;
      } else {
        apiUrl = `${this.baseUrl}/api/blockchain/search?query=${this.searchQuery}&blockchain=${this.selectedBlockchain}`;
      }

      localStorage.setItem('selectedBlockchain', this.selectedBlockchain);

      this.http.get(apiUrl).subscribe({
        next: (data: any) => {
          if (this.isTransactionId(this.searchQuery)) {
            this.router.navigate(['/transaction-details', this.searchQuery]);
            localStorage.setItem("transactionInfo", JSON.stringify(data));
          }
          this.blockchainInfo = data.m;
          localStorage.setItem("blockchainInfo", JSON.stringify(this.blockchainInfo));
          if (this.blockchainInfo.height) {
            this.router.navigate(
              ['/block', this.selectedBlockchain, this.blockchainInfo.height],
            );
          }
          this.cdf.detectChanges();
        },
        error: (err) => {
          console.error('Search failed:', err);
          this.blockchainInfo = { error: 'Failed to fetch data from blockchain.' };
        }
      });
    }
  }

  isTransactionId(query: string): boolean {
    return /^[0-9a-fA-F]{64}$/.test(query);
  }

  isBlockHash(query: string): boolean {
    return /^0{10}/.test(query);
  }

}
