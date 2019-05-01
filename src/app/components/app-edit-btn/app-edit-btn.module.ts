import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { AppEditButtonComponent } from './app-edit-btn.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  exports: [    
    AppEditButtonComponent,
  ],
  declarations: [    
    AppEditButtonComponent,
  ]
})
export class AppEditButtonModule { }
