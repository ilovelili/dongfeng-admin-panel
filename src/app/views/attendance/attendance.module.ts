import { NgModule } from '@angular/core';
import { DataTableModule } from 'angular2-datatable';

//Routing
import { AttendanceRoutingModule } from './attendance-routing.module';
import { ToasterModule } from 'angular2-toaster';
import { AttendanceComponent } from './attendance.component';
import { AppCsvModule } from '../../components';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataFilterPipe } from './datafilterpipeline';

@NgModule({
  imports: [
    AttendanceRoutingModule,
    CommonModule,    
    ToasterModule,
    AppCsvModule,    
    FileUploadModule,
    DataTableModule,
    FormsModule,    
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],  
  declarations: [
    AttendanceComponent,
    DataFilterPipe
  ]
})
export class AttendanceModule { }
