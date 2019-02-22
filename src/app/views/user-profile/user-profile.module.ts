import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Routing
import { UserProfileRoutingModule } from './user-profile-routing.module';

import { UserProfileComponent } from './user-profile.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
  imports: [
    UserProfileRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    ToasterModule,
  ],
  declarations: [
    UserProfileComponent
  ]
})
export class UserProfileModule { }
