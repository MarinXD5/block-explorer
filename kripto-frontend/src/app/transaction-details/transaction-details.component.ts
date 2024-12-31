import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css'
})
export class TransactionDetailsComponent implements OnInit{

  transactionInfo: any | null = null;

  ngOnInit(): void {
    this.transactionInfo = JSON.parse(localStorage.getItem('transactionInfo')!);
  }

  calculateTotalVin(vin: any[]): number {
    return vin.reduce((sum, input) => sum + (input.value || 0), 0);
  }

  calculateTotalVout(vout: any[]): number {
    return vout.reduce((sum, output) => sum + (output.value || 0), 0);
  }

  calculateTransactionFee(vin: any[], vout: any[]): number {
    const totalVin = this.calculateTotalVin(vin);
    const totalVout = this.calculateTotalVout(vout);
    return totalVout - totalVin;
  }
}
