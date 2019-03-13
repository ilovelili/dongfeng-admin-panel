import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCsvDownloadService } from './app-csv-download.service';
import { AppCsvDownloadComponent } from './app-csv-download.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    AppCsvDownloadComponent,
  ],
  declarations: [
    AppCsvDownloadComponent,
  ],
  providers: [
    AppCsvDownloadService,
  ]
})
export class AppCsvModule { }
