import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BlockDisplayComponent } from './block-display/block-display.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'block/:blockHeight', component: BlockDisplayComponent },
];
