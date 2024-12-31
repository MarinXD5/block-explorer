import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BlockDisplayComponent } from './block-display/block-display.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'block/:selectedBlockchain/:blockHeight', component: BlockDisplayComponent },
  { path: 'transaction-details', component: TransactionDetailsComponent },
];