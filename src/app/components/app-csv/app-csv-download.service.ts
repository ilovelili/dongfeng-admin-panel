import { Injectable } from '@angular/core';
import { CsvEntity, CsvFormat, CsvRecord } from './app-csv-model';

@Injectable()
export class AppCsvDownloadService {
  constructor() {
  }

  private static csvResponseHeader: string = 'data:text/csv;charset=utf-8,%EF%BB%BF';  // with bom

  private static resolveDefaultContent(data: Object[], format: CsvFormat): string {
    let entity = new CsvEntity();
    entity.Headers = [];
    entity.Rows = [];
    // header
    let defaultHeader = !format || !format.Headers;
    if (defaultHeader) {
      for (var key in data[0]) entity.Headers.push(key);
    }
    else {
      entity.Headers = format.Headers;
    }

    let defaultColumns = !format || !format.Columns;
    data.map((obj) => {
      let rec = new CsvRecord();
      rec.Items = [];
      if (defaultColumns) {
        for (var o in obj) rec.Items.push(obj[o]);
      }
      else {
        for (var conIdx in format.Columns) {
          rec.Items.push(obj[format.Columns[conIdx]]);
        }

      }
      entity.Rows.push(rec);
    });

    return AppCsvDownloadService.resolveCustomContent(entity);
  }

  private static resolveCustomContent(entity: CsvEntity): string {
    let csvContent = "", title = entity.Headers;
    csvContent += title.join(',') + '\n';
    // body
    for (var key in entity.Rows) csvContent += entity.Rows[key].Items.join(',') + '\n';
    return csvContent;
  }

  // Write Default CSV
  WriteDefaultCSV(data: Object[], fileName: string) {
    return this.WriteFormattedCSV(data, null, fileName);
  }

  WriteFormattedCSV(data: Object[], format: CsvFormat, fileName: string) {
    let csvContent = AppCsvDownloadService.resolveDefaultContent(data, format);
    this.WriteCSV(csvContent, fileName);
  }

  // Write Default CSV
  WriteCustomCSV(data: CsvEntity, fileName: string) {
    let csvContent = AppCsvDownloadService.resolveCustomContent(data);
    this.WriteCSV(csvContent, fileName);
  }

  private WriteCSV(csvContent: string, fileName: string) {
    let encodedUri = AppCsvDownloadService.csvResponseHeader + encodeURI(csvContent),
      link = document.createElement('a');

    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden'; // must append link to get full ff support
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}