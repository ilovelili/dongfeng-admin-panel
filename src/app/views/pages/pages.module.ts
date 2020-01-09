import { NgModule } from '@angular/core';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';

import { PagesRoutingModule } from './pages-routing.module';
import { TooltipModule, ModalModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { PasswordComponent } from './password.component';
import { OpenIdDingTalkComponent } from './openid.component';
import { BranchComponent } from './branch.component';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),  
   ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    PasswordComponent,
    OpenIdDingTalkComponent,
    BranchComponent,
  ]
})
export class PagesModule { }