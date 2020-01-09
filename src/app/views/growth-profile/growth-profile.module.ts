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
import { GrowthProfileTemplateComponent } from './growth-profile-template.component';
import { ModalModule } from 'ngx-bootstrap';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { DataFilterPipe } from '../growth-profile/datafilterpipeline';
import { DataTableModule } from 'angular2-datatable';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ToasterModule,
    AppLoadingModule,
    DataTableModule,    
    GrowthProfileRoutingModule,
    ChartsModule,
    BsDropdownModule,
    NgxTypeaheadModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  declarations: [ 
    GrowthProfileComponent,
    GrowthProfileTemplateComponent,
    EBookComponent,
    DataFilterPipe,
  ]
})

export class GrowthProfileModule {}