import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppImageUploadComponent } from './app-image-upload.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    AppImageUploadComponent
  ],
  declarations: [
    AppImageUploadComponent
  ]
})
export class AppImageUploadModule { }
