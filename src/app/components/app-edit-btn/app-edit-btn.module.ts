import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEditButtonComponent } from './app-edit-btn.component';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  exports: [
    AppEditButtonComponent
  ],
  declarations: [
    AppEditButtonComponent
  ]
})
export class AppEditButtonModule { }
