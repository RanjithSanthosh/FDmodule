import { Deposit } from './components/deposits/deposit/deposit';
import { Deposits } from './components/deposits/deposits'; // Added import
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { IntPayment } from './components/int-payments/int-payment/int-payment';
import { IntPayments } from './components/int-payments/int-payments';
import { DepositSummary } from './components/deposit-summary/deposit-summary';
import { CustomerHistory } from './components/customer-history/customer-history';
import { Depositors } from './components/depositors/depositors';
import { DepositHistory } from './components/deposit-history/deposit-history';
import { Schemes } from './components/schemes/schemes';
import { Scheme } from './components/schemes/scheme/scheme';
import { Settings } from './components/settings/settings';
import { SidebarComponent } from './components/sidebar/sidebar';
import { Closures } from './components/closures/closures';
import { Closure } from './components/closures/closure/closure';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'deposits', component: Deposits }, // Added List Route
  { path: 'deposit', component: Deposit }, // Kept Detail Route
  { path: 'int-payments', component: IntPayments }, // Added List Route
  { path: 'int-payment', component: IntPayment }, // Kept Detail Route
  { path: 'closures', component: Closures },
  { path: 'closure', component: Closure },
  { path: 'deposit-summary', component: DepositSummary },
  { path: 'customer-history', component: CustomerHistory },
  { path: 'deposit-history', component: DepositHistory },
  { path: 'depositors', component: Depositors },
  { path: 'schemes', component: Schemes },
  { path: 'scheme', component: Scheme },
  { path: 'settings', component: Settings },
  { path: 'sidebar', component: SidebarComponent },
];

