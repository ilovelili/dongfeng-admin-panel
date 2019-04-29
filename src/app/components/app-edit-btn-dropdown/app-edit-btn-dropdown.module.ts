import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEditButtonDropDownComponent } from './app-edit-btn-dropdown.component';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  exports: [
    AppEditButtonDropDownComponent,
  ],
  declarations: [
    AppEditButtonDropDownComponent,
  ]
})
export class AppEditButtonDropDownModule { }
