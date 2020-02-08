import { NgModule } from '@angular/core';
import { DataTableModule } from 'angular2-datatable';

//Routing
import { AdminRoutingModule } from './admin-routing.module';
import { ToasterModule } from 'angular2-toaster';
import { UserAdminComponent } from './user-admin.component';
import { AppCsvModule, AppLoadingModule } from '../../components';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataFilterPipe } from './datafilterpipeline';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,    
    ToasterModule,
    AppCsvModule,    
    FileUploadModule,
    DataTableModule,
    FormsModule,
    AppLoadingModule,    
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],  
  declarations: [
    UserAdminComponent,
    DataFilterPipe,
  ]
})
export class AdminModule { }
