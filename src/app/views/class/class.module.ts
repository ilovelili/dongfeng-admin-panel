import { NgModule } from '@angular/core';
import { DataTableModule } from 'angular2-datatable';

//Routing
import { ClassRoutingModule } from './class-routing.module';
import { ToasterModule } from 'angular2-toaster';
import { ClassComponent } from './class.component';
import { AppCsvModule } from '../../components';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataFilterPipe } from '../base/datafilterpipe';

@NgModule({
  imports: [
    ClassRoutingModule,
    CommonModule,    
    ToasterModule,
    AppCsvModule,    
    FileUploadModule,
    DataTableModule,
    FormsModule,    
    ModalModule.forRoot(),    
  ],  
  declarations: [
    ClassComponent,
    DataFilterPipe
  ]
})
export class ClassModule { }
