import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css'
})
export class TransactionDetailsComponent implements OnInit{

  data: any;
  transaction: any;
  fee: any;
  baseUrl: string = "http://localhost:8080"
  vinWithAmounts: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

   ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.updateTransactionDetails();
    });

    this.updateTransactionDetails();
  }

  updateTransactionDetails(): void {
    this.data = JSON.parse(localStorage.getItem('transactionInfo')!);

    if (this.data) {
      const feeKey = Object.keys(this.data)[0];
      this.fee = feeKey;
      this.transaction = this.data[feeKey].rawTransaction.m;
      this.vinWithAmounts = this.data[feeKey].vinWithAmounts;
    }
  }

  navigateToBlockHash(blockHash: string){
    const selectedBlockchain = localStorage.getItem('selectedBlockchain');
    const apiUrl = `${this.baseUrl}/api/blockchain/search?query=${blockHash}&blockchain=${selectedBlockchain}`;

    this.http.get(apiUrl).subscribe((data: any)=>{
      localStorage.setItem('blockchainInfo', JSON.stringify(data.m));

      this.router.navigate(
        ['/block', selectedBlockchain, data.m.height],
      );
      
    })
  }

}
