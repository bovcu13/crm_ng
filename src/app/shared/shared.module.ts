import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrimengModule} from './primeng/primeng.module';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    PrimengModule,
    HttpClientModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule {
}
