import { NgModule } from '@angular/core';
import { DataTableModule } from 'angular2-datatable';

//Routing
import { PupilRoutingModule } from './pupil-routing.module';
import { ToasterModule } from 'angular2-toaster';
import { AppCsvModule, AppLoadingModule, AppEditButtonModule } from '../../components';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { PupilComponent } from './pupil.component';
import { DataFilterPipe } from './datafilterpipeline';

@NgModule({
  imports: [
    PupilRoutingModule,
    CommonModule,    
    ToasterModule,
    AppCsvModule,    
    FileUploadModule,
    DataTableModule,
    FormsModule,
    AppLoadingModule,
    AppEditButtonModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],  
  declarations: [
    PupilComponent,
    DataFilterPipe
  ]
})
export class PupilModule { }
