import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContainerComponent } from './container.component';
import { ContainerRoutingModule } from './container-routing.module';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { AccountComponent } from '../features/account/account.component';
import { CampaignComponent } from '../features/campaign/campaign.component';
import { ContactComponent } from '../features/contact/contact.component';
import { DisplayComponent } from '../features/display/display.component';
import { EventComponent } from '../features/event/event.component';
import { ForecastingComponent } from '../features/forecasting/forecasting.component';
import { LeadComponent } from '../features/lead/lead.component';
import { OpportunityComponent } from '../features/opportunity/opportunity.component';
import { QuoteComponent } from '../features/quote/quote.component';
import { ReportComponent } from '../features/report/report.component';
import { ViewLeadComponent} from "../features/lead/view-lead/view-lead.component";

@NgModule({
  declarations: [
    ContainerComponent,
    ToolbarComponent,
    DashboardComponent,
    AccountComponent,
    CampaignComponent,
    ContactComponent,
    DisplayComponent,
    EventComponent,
    ForecastingComponent,
    LeadComponent,
    OpportunityComponent,
    QuoteComponent,
    ReportComponent,
    ViewLeadComponent
  ],
  imports: [
    CommonModule,
    ContainerRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ContainerModule { }
