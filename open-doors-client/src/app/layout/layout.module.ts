import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from "@angular/router";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MaterialModule } from '../infrastucture/material/material.module';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NavBarComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NavBarComponent
  ]
})
export class LayoutModule { }
