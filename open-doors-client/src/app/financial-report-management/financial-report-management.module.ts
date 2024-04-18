import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialReportPageComponent } from './financial-report-page/financial-report-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {MatTableModule} from '@angular/material/table';
import { MaterialModule } from '../infrastucture/material/material.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    FinancialReportPageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CanvasJSAngularChartsModule,
    MatTableModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FinancialReportManagementModule { }
