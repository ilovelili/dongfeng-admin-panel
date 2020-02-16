import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppImageUploadComponent } from './app-image-upload.component';
import { CommonModule } from '@angular/common';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ToasterModule,
  ],
  exports: [
    AppImageUploadComponent
  ],
  declarations: [
    AppImageUploadComponent
  ]
})
export class AppImageUploadModule { }
