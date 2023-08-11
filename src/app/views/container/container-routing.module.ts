import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../shared/guard/auth.guard";
import {ContainerComponent} from './container.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {AccountComponent} from '../features/account/account.component';
import {CampaignComponent} from '../features/campaign/campaign.component';
import {ContactComponent} from '../features/contact/contact.component';
import {DisplayComponent} from '../features/display/display.component';
import {EventComponent} from '../features/event/event.component';
import {ForecastingComponent} from '../features/forecasting/forecasting.component';
import {LeadComponent} from '../features/lead/lead.component';
import {OpportunityComponent} from '../features/opportunity/opportunity.component';
import {ViewOpportunityComponent} from "../features/opportunity/view-opportunity/view-opportunity.component";
import {QuoteComponent} from '../features/quote/quote.component';
import {ReportComponent} from '../features/report/report.component';
import {ViewLeadComponent} from "../features/lead/view-lead/view-lead.component";
import {ViewAccountComponent} from '../features/account/view-account/view-account.component';
import {ViewContactComponent} from '../features/contact/view-contact/view-contact.component';
import {ProductComponent} from '../features/product/product.component';
import {OrderComponent} from '../features/order/order.component';
import {ContractComponent} from '../features/contract/contract.component';
import {ViewQuoteComponent} from '../features/quote/view-quote/view-quote.component';
import {ViewOrderComponent} from '../features/order/view-order/view-order.component';
import {ViewContractComponent} from '../features/contract/view-contract/view-contract.component';
import {ViewCampaignComponent} from '../features/campaign/view-campaign/view-campaign.component';
import { RoleComponent } from '../features/role/role.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '', component: ContainerComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
      {path: 'account/view/:id', component: ViewAccountComponent, canActivate: [AuthGuard]},
      {path: 'campaign', component: CampaignComponent, canActivate: [AuthGuard]},
      {path: 'campaign/view/:c_id', component: ViewCampaignComponent, canActivate: [AuthGuard]},
      {path: 'contact/view/:id', component: ViewContactComponent, canActivate: [AuthGuard]},
      {path: 'contact', component: ContactComponent, canActivate: [AuthGuard]},
      {path: 'display', component: DisplayComponent, canActivate: [AuthGuard]},
      {path: 'event', component: EventComponent, canActivate: [AuthGuard]},
      {path: 'forecasting', component: ForecastingComponent, canActivate: [AuthGuard]},
      {path: 'lead', component: LeadComponent, canActivate: [AuthGuard]},
      {path: 'lead/view/:id', component: ViewLeadComponent, canActivate: [AuthGuard]},
      {path: 'product', component: ProductComponent, canActivate: [AuthGuard]},
      {path: 'opportunity', component: OpportunityComponent, canActivate: [AuthGuard]},
      {path: 'opportunity/view/:id', component: ViewOpportunityComponent, canActivate: [AuthGuard]},
      {path: 'order', component: OrderComponent, canActivate: [AuthGuard]},
      {path: 'order/view/:o_id', component: ViewOrderComponent, canActivate: [AuthGuard]},
      {path: 'quote', component: QuoteComponent, canActivate: [AuthGuard]},
      {path: 'quote/view/:q_id', component: ViewQuoteComponent, canActivate: [AuthGuard]},
      {path: 'contract', component: ContractComponent, canActivate: [AuthGuard]},
      {path: 'contract/view/:c_id', component: ViewContractComponent, canActivate: [AuthGuard]},
      {path: 'report', component: ReportComponent, canActivate: [AuthGuard]},
      {path: 'role', component: RoleComponent, canActivate: [AuthGuard]},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule {
}
