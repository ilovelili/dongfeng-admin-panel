import { NgModule } from '@angular/core';
import { DataTableModule } from 'angular2-datatable';

//Routing
import { TeacherRoutingModule } from './teacher-routing.module';
import { ToasterModule } from 'angular2-toaster';
import { TeacherComponent } from './teacher.component';
import { AppCsvModule, AppLoadingModule, AppEditButtonModule } from '../../components';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataFilterPipe } from './datafilterpipeline';

@NgModule({
  imports: [
    TeacherRoutingModule,
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
    TeacherComponent,
    DataFilterPipe
  ]
})
export class TeacherModule { }
