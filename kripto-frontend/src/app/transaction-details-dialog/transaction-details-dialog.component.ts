import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-details-dialog',
  imports: [CommonModule],
  templateUrl: './transaction-details-dialog.component.html',
  styleUrl: './transaction-details-dialog.component.css'
})
export class TransactionDetailsDialogComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  fee: string | null = null;
  transaction: any;
  vinWithAmounts: any;

  ngOnInit(): void {
    const feeKey = Object.keys(this.data)[0];
    this.fee = feeKey;
    this.transaction = this.data[feeKey].rawTransaction.m;

    this.vinWithAmounts = this.data[feeKey].vinWithAmounts;
  }

}