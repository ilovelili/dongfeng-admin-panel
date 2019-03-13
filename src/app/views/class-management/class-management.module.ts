import { NgModule } from '@angular/core';

//Routing
import { ClassManagementRoutingModule } from './class-management-routing.module';
import { ToasterModule } from 'angular2-toaster';
import { ClassManagementComponent } from './class-management.component';
import { AppCsvModule } from '../../components';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    ClassManagementRoutingModule,
    CommonModule,    
    ToasterModule,
    AppCsvModule,    
    FileUploadModule,
    ModalModule.forRoot(),
  ],  
  declarations: [
    ClassManagementComponent
  ]
})
export class ClassManagementModule { }
