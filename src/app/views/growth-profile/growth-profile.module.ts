import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { GrowthProfileComponent } from './growth-profile.component';
import { GrowthProfileRoutingModule } from './growth-profile-routing.module';
import { CommonModule } from '@angular/common';
import { ToasterModule } from 'angular2-toaster';
import { AppLoadingModule } from 'app/components';
import { EBookComponent } from './ebook.component';
import { ModalModule } from 'ngx-bootstrap';
import { NgxTypeaheadModule } from 'ngx-typeahead';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ToasterModule,
    AppLoadingModule,
    GrowthProfileRoutingModule,
    ChartsModule,
    BsDropdownModule,
    NgxTypeaheadModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  declarations: [ 
    GrowthProfileComponent,
    EBookComponent,
  ]
})

export class GrowthProfileModule {}
