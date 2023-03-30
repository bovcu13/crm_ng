import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShareModule } from './share/share.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    DashboardComponent,
    LeadComponent,
    AccountComponent,
    ContactComponent,
    OpportunityComponent,
    QuoteComponent,
    CampaignComponent,
    ForecastingComponent,
    ReportComponent,
    EventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ShareModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
