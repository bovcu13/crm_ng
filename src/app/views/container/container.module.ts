import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContainerComponent } from './container.component';
import { ContainerRoutingModule } from './container-routing.module';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    ContainerComponent,
    ToolbarComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    ContainerRoutingModule,
    SharedModule
  ]
})
export class ContainerModule { }
