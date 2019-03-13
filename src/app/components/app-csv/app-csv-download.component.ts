import {Component, Input, Output, EventEmitter} from '@angular/core';
import { CsvFormat } from './app-csv-model';

@Component({
    selector: 'csv',
    template: `<a href="javascript:;" data-toggle="tooltip" title="下载csv文件" (click)="CommitDownload()"><i class="fa fa-download right pointer" aria-hidden="true"></i></a>`,
})

export class AppCsvDownloadComponent {
    @Input("headers")
    public headers: string[];
    @Input("columns")
    public columns: string[];

    @Output()
    Download = new EventEmitter<CsvFormat>();

    CommitDownload() {        
        this.Download.emit(new CsvFormat(this.headers, this.columns));
    };
}