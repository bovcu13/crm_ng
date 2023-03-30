import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/features/dashboard/dashboard.component';
import { LeadComponent } from './views/features/lead/lead.component';
import { AccountComponent } from './views/features/account/account.component';
import { ContactComponent } from './views/features/contact/contact.component';
import { OpportunityComponent } from './views/features/opportunity/opportunity.component';
import { QuoteComponent } from './views/features/quote/quote.component';
import { CampaignComponent } from './views/features/campaign/campaign.component';
import { ForecastingComponent } from './views/features/forecasting/forecasting.component';
import { ReportComponent } from './views/features/report/report.component';
import { EventComponent } from './views/features/event/event.component';
const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'Lead', component: LeadComponent},
  {path: 'Account', component: AccountComponent},
  {path: 'Contact', component: ContactComponent},
  {path: 'Opportunity', component: OpportunityComponent},
  {path: 'Quote', component: QuoteComponent},
  {path: 'Campaign', component: CampaignComponent},
  {path: 'Forecasting', component: ForecastingComponent},
  {path: 'Report', component: ReportComponent},
  {path: 'Event', component: EventComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
