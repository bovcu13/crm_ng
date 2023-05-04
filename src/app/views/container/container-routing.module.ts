import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { AccountComponent } from '../features/account/account.component';
import { CampaignComponent } from '../features/campaign/campaign.component';
import { ContactComponent } from '../features/contact/contact.component';
import { DisplayComponent } from '../features/display/display.component';
import { EventComponent } from '../features/event/event.component';
import { ForecastingComponent } from '../features/forecasting/forecasting.component';
import { LeadComponent } from '../features/lead/lead.component';
import { OpportunityComponent } from '../features/opportunity/opportunity.component';
import { ViewOpportunityComponent} from "../features/opportunity/view-opportunity/view-opportunity.component";
import { QuoteComponent } from '../features/quote/quote.component';
import { ReportComponent } from '../features/report/report.component';
import { ViewLeadComponent} from "../features/lead/view-lead/view-lead.component";
import { ViewAccountComponent } from '../features/account/view-account/view-account.component';
import { ViewContactComponent } from '../features/contact/view-contact/view-contact.component';
import { ProductComponent } from '../features/product/product.component';
import { OrderComponent } from '../features/order/order.component';
import { ContractComponent } from '../features/contract/contract.component';
import { ViewQuoteComponent } from '../features/quote/view-quote/view-quote.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '', component: ContainerComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'account', component: AccountComponent },
      { path: 'account/view', component: ViewAccountComponent },
      { path: 'campaign', component: CampaignComponent },
      { path: 'contact/view', component: ViewContactComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'display', component: DisplayComponent },
      { path: 'event', component: EventComponent },
      { path: 'forecasting', component: ForecastingComponent },
      { path: 'lead', component: LeadComponent },
      { path: 'lead/view', component: ViewLeadComponent },
      { path: 'product', component: ProductComponent },
      { path: 'opportunity', component: OpportunityComponent },
      { path: 'opportunity/view', component: ViewOpportunityComponent },
      { path: 'order', component: OrderComponent },
      { path: 'quote', component: QuoteComponent },
      { path: 'quote/view/:q_id', component: ViewQuoteComponent },
      { path: 'contract', component: ContractComponent },
      { path: 'report', component: ReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule { }
