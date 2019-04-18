import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLoadingComponent } from './app-loading.component';

@NgModule({
  imports: [
    CommonModule,    
  ],
  exports: [
    AppLoadingComponent
  ],
  declarations: [
    AppLoadingComponent
  ]
})
export class AppLoadingModule { }
