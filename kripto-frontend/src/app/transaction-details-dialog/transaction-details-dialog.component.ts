import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-details-dialog',
  imports: [CommonModule],
  templateUrl: './transaction-details-dialog.component.html',
  styleUrl: './transaction-details-dialog.component.css'
})
export class TransactionDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

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