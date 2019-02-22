import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Routing
import { UserProfileRoutingModule } from './user-profile-routing.module';

import { UserProfileComponent } from './user-profile.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToasterModule } from 'angular2-toaster';
import { AppImageUploadModule } from '../../components';

@NgModule({
  imports: [
    UserProfileRoutingModule,
    FormsModule,
    ToasterModule,
    AppImageUploadModule,
    BsDropdownModule.forRoot(),
  ],  
  declarations: [
    UserProfileComponent
  ]
})
export class UserProfileModule { }
