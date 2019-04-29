import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { AppEditButtonInputComponent } from './app-edit-btn-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  exports: [    
    AppEditButtonInputComponent,
  ],
  declarations: [    
    AppEditButtonInputComponent,
  ]
})
export class AppEditButtonInputModule { }
