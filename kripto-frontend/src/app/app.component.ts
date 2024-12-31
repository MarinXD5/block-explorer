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
      const apiUrl = `${this.baseUrl}/api/blockchain/search?query=${this.searchQuery}&blockchain=${this.selectedBlockchain}`;

      this.http.get(apiUrl, { responseType: 'json' }).subscribe({
        next: (data: any) => {
          this.blockchainInfo = data.m;
          //console.log(this.blockchainInfo);
          if (this.blockchainInfo.height) {
            this.router.navigate(['/block', this.selectedBlockchain, this.blockchainInfo.height]);
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
}