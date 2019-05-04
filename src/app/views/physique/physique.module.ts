import { NgModule } from '@angular/core';
import { DataTableModule } from 'angular2-datatable';

//Routing
import { PhysiqueRoutingModule } from './physique-routing.module';
import { ToasterModule } from 'angular2-toaster';
import { PhysiqueComponent } from './physique.component';
import { AppCsvModule, AppLoadingModule, AppEditButtonModule } from '../../components';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { ModalModule, BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataFilterPipe } from './datafilterpipeline';

@NgModule({
  imports: [
    PhysiqueRoutingModule,
    CommonModule,
    ToasterModule,
    AppCsvModule,
    FileUploadModule,
    DataTableModule,
    FormsModule,
    AppLoadingModule,    
    AppEditButtonModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    PhysiqueComponent,
    DataFilterPipe
  ],
})
export class PhysiqueModule { }
