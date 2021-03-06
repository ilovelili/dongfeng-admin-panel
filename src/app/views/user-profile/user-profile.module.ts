import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Routing
import { UserProfileRoutingModule } from './user-profile-routing.module';

import { UserProfileComponent } from './user-profile.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToasterModule } from 'angular2-toaster';
import { AppImageUploadModule } from '../../components';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    FormsModule,
    ToasterModule,
    AppImageUploadModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],  
  declarations: [
    UserProfileComponent
  ]
})
export class UserProfileModule { }
