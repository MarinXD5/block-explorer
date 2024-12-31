import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedBlockchain = 'bitcoin_mainnet';
  searchQuery = '';
  blockchainInfo: any = null;
  baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient, private cdf: ChangeDetectorRef, private router: Router) {}

  searchBlockchain() {
    if (this.searchQuery) {
      const apiUrl =
      this.isTransactionId(this.searchQuery)
        ? `${this.baseUrl}/api/blockchain/transaction?blockchain=${this.selectedBlockchain}&txId=${this.searchQuery}`
        : `${this.baseUrl}/api/blockchain/search?query=${this.searchQuery}&blockchain=${this.selectedBlockchain}`;
  
      localStorage.setItem('selectedBlockchain', this.selectedBlockchain);

      this.http.get(apiUrl, { responseType: 'json' }).subscribe({
        next: (data: any) => {
          if (this.isTransactionId(this.searchQuery)) {
            this.router.navigate(['/transaction-details']);
            localStorage.setItem("transactionInfo", JSON.stringify(data.m));
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
        },
      });
    }
  }

  isTransactionId(query: string): boolean {
    return /^[0-9a-fA-F]{64}$/.test(query);
  }
}