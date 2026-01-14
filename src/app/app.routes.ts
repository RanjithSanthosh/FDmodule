import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { Deposits } from './components/deposits/deposits';
import { Deposit } from './components/deposits/deposit/deposit';
import { IntPayments } from './components/int-payments/int-payments';
import { IntPayment } from './components/int-payments/int-payment/int-payment';
import { Closures } from './components/closures/closures';
import { Closure } from './components/closures/closure/closure';
import { DepositSummary } from './components/deposit-summary/deposit-summary';
import { CustomerHistory } from './components/customer-history/customer-history';
import { DepositHistory } from './components/deposit-history/deposit-history';
import { Depositors } from './components/depositors/depositors';
import { Depositor } from './components/depositors/depositor/depositor';
import { Schemes } from './components/schemes/schemes';
import { Scheme } from './components/schemes/scheme/scheme';
import { Settings } from './components/settings/settings';
import { SidebarComponent } from './components/sidebar/sidebar';
import { FDfrontendComponent } from './fdfrontend/fdfrontend.component';
import { MainCompComponent } from './components/main-comp/main-comp.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  {
    path: 'fdfrontend',
    component: FDfrontendComponent,
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'deposits', component: Deposits },
      { path: 'deposit', component: Deposit },
      { path: 'int-payments', component: IntPayments },
      { path: 'int-payment', component: IntPayment },
      { path: 'closures', component: Closures },
      { path: 'closure', component: Closure },
      { path: 'deposit-summary', component: DepositSummary },
      { path: 'customer-history', component: CustomerHistory },
      { path: 'deposit-history', component: DepositHistory },
      { path: 'depositors', component: Depositors },
      { path: 'depositor', component: Depositor },
      { path: 'schemes', component: Schemes },
      { path: 'scheme', component: Scheme },
      { path: 'settings', component: Settings },
    ]
  }
];

