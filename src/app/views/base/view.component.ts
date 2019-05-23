import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from 'app/components';
import { CsvFormat } from 'app/components/app-csv/app-csv-model';
import { SessionFactory, SessionConfig } from 'app/sessionstorage/sessionfactory.service';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { BsDatepickerConfig, zhCn, BsLocaleService } from 'ngx-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { DateRange } from 'app/models';
import { ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { BaseComponent } from 'app/base.component';
import { AuthService } from 'app/auth/auth.service';

export abstract class ViewComponent extends BaseComponent {
  // user viewchild to get dom element by ref (#infoModal)
  @ViewChild('infoModal') infoModal
  @ViewChild('conditionModal') conditionModal
  @ViewChild('explainModal') explainModal

  protected loading: boolean;

  protected template: any[] = [];
  protected items: any[] = [];

  protected key_token: string = 'token';
  protected namespace: string = 'dongfeng';
  protected sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));
  protected params: Object

  protected filterQuery = '';
  protected years = [];
  protected classes = [];
  protected currentYear = '';
  protected currentClass = '';
  protected currentName = '';  
  protected dateFrom = '';
  protected dateTo = '';
  protected dateRange: Date[];
  protected datepickerconfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  protected searchcriteria = {
    year: '学年',
    class: '班级',
    name: '姓名',
  };

  protected csvDownloader: AppCsvDownloadService = new AppCsvDownloadService();

  fileUploader1: FileUploader = new FileUploader({});
  fileUploader2: FileUploader = new FileUploader({});
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;

  protected fileOverBase = (e) => {
    this.hasBaseDropZoneOver = e;
  }

  protected toasterconfig: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: true,
      timeout: 5000,
    });

  protected initfileuploader(fileUploader: FileUploader, endpoint: string, msg: string, callback?: Function, errcallback?: Function) {
    fileUploader.setOptions({
      url: `${environment.api.baseURI}/${endpoint}`,
      allowedMimeType: ['text/csv'],
      method: 'POST',
      autoUpload: true,
      authToken: `Bearer ${this.sessionFactory.get(this.key_token)}`,
      authTokenHeader: `Authorization`,
    });

    fileUploader.onProgressItem = () => {
      this.toasterService.pop('info', '', '上传中');
    };

    fileUploader.onSuccessItem = () => {      
      if (!callback) {
        this.toasterService.pop('success', '', `上传${msg}信息成功`);
        window.location.reload();
      } else {
        callback(this);
      }
    };

    fileUploader.onErrorItem = (_, res) => {      
      if (!errcallback) {
        console.error(res);
        this.toasterService.pop('error', '', `上传${msg}信息失败，请重试`);        
      } else {
        errcallback(res, this);
      }
    };

    fileUploader.onCompleteAll = () => {
      if (callback) {
        this.infoModal.hide();
        callback(this);
      }
    };
  }

  constructor(protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService, protected localeService?: BsLocaleService) {
    super(router,authService);
    
    this.loading = true;

    this.activatedRoute.params.subscribe((params) => {
      this.params = params;

      this.currentYear = this.params["year"];
      this.currentClass = this.params["class"];
      this.currentName = this.params["name"];      

      this.dateFrom = this.params["from"] || this.formatDate(this.firstDayInPrevMonth());
      this.dateTo = this.params["to"] || this.formatDate(new Date());
      this.dateRange = new DateRange(this.dateFrom, this.dateTo).format();

      if (this.localeService) {
        // https://github.com/valor-software/ngx-bootstrap/issues/4054    
        this.localeService.use(zhCn.abbr);
        this.datepickerconfig = {
          containerClass: 'theme-dark-blue',
          value: this.dateRange,
          dateInputFormat: 'yyyy-MM-dd',
        };
      }
    });
  }

  protected showconditionsearch() {
    if (this.infoModal) {
      this.infoModal.hide();
    }

    if (this.explainModal) {
      this.explainModal.hide();
    }

    if (this.conditionModal) {
      this.conditionModal.show();
    }
  }

  protected showupload() {
    if (this.conditionModal) {
      this.conditionModal.hide();
    }

    if (this.explainModal) {
      this.explainModal.hide();
    }

    if (this.infoModal) {
      this.infoModal.show();
    }
  }

  protected showexplain() {
    if (this.conditionModal) {
      this.conditionModal.hide();
    }

    if (this.infoModal) {
      this.infoModal.hide();
    }

    if (this.explainModal) {
      this.explainModal.show();
    }
  }

  protected DownloadCsv = (downloadtemplate: boolean, filename?: string, format?: CsvFormat) => {
    filename = filename || (window.location.hash.replace('#/', '') || (this.activatedRoute.component as any).name) + '.csv';
    let items = downloadtemplate ? this.template : this.items;
    this.csvDownloader.WriteFormattedCSV(items, format, filename);
  };

  protected LogComplete = (msg: string) => {
    console.log(msg);
  };

  protected LogError = (err: string, msg: string) => {
    console.error(err);
    this.toasterService.pop('error', '', msg);
  };

  protected LogSuccess = (msg: string) => {
    console.log(msg);
    this.toasterService.pop('success', '', msg);
  };

  protected setyear(year: string) {
    if (year != this.currentYear) {
      this.currentYear = year;
    }

    if (year == '') {
      this.searchcriteria.year = '学年';
    } else {
      {
        this.searchcriteria.year = year;
      }
    }
  }

  protected setclass(cls: string) {
    if (cls != this.currentClass) {
      this.currentClass = cls;
    };

    if (cls == '') {
      this.searchcriteria.class = '班级';
    } else {
      this.searchcriteria.class = cls;
    }
  }

  protected setname(name: string) {
    if (name != this.currentName) {
      this.currentName = name;
    };

    if (name == '') {
      this.searchcriteria.name = '姓名';
    } else {
      this.searchcriteria.name = name;
    }
  }

  protected setfrom(from: string) {
    if (from != this.dateFrom) {
      this.dateFrom = from;
    };
  }

  protected setto(to: string) {
    if (to != this.dateTo) {
      this.dateTo = to;
    };
  } 

  protected filename(prefix: string): string {
    let filename = `${prefix}_${this.currentClass ? '_' + this.currentClass : ''}${this.currentYear ? '_' + this.currentYear + '学年' : ''}${this.currentName ? '_' + this.currentName : ''}${this.dateFrom ? '_' + this.dateFrom : ''}${this.dateTo ? '_' + this.dateTo : ''}`;
    
    if (filename.endsWith('_')) {
      filename = filename.substring(0, filename.length - 1);
    }

    return `${filename}.csv`;
  }

  protected formatDate(d: Date): string {
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  protected firstDayInPrevMonth(): Date {
    let d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    return d;
  }

  protected monday(): Date {
    let d = new Date();
    let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  protected friday(): Date {
    let monday = this.monday(),
      diff = monday.getDate() + 4;
    return new Date(monday.setDate(diff));
  }
}