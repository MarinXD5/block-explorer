import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BlockDisplayComponent } from './block-display/block-display.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'block/:selectedBlockchain/:blockHeight', component: BlockDisplayComponent },
  { path: 'transaction-details/:txId', component: TransactionDetailsComponent}
];
