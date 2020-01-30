import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from 'app/components';
import { CsvFormat } from 'app/components/app-csv/app-csv-model';
import { SessionFactory, SessionConfig } from 'app/sessionstorage/sessionfactory.service';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { zhCnLocale, BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { DateRange } from 'app/models';
import { ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { BaseComponent } from 'app/base.component';
import { AuthService } from 'app/services';

export abstract class ViewComponent extends BaseComponent {
  // use viewchild to get dom element by ref (#infoModal)
  @ViewChild('infoModal') infoModal
  @ViewChild('conditionModal') conditionModal
  @ViewChild('explainModal') explainModal

  protected loading: boolean;
  protected found: boolean = true;

  protected template: any[] = [];
  protected items: any[] = [];

  protected key_token: string = 'token';
  protected key_year: string = 'year';
  protected namespace: string = 'dongfeng';
  protected sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));
  protected params: Object

  protected filterQuery = '';
  protected currentYear: string = '';
  protected currentClass: number; // class ID
  protected currentName: number; // pupil ID
  protected currentDate = '';  
  protected dateFrom = '';
  protected dateTo = '';
  protected dateRange: Date[];
  protected daterangepickerconfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();  
  
  protected classMap: Map<number, string> = new Map();
  protected pupilMap: Map<number, string> = new Map();

  protected searchcriteria = {
    year: '学年',
    class: '班级',
    name: '姓名',
    date: '日期',
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
    super(router, authService);

    this.loading = true;
    this.currentYear = this.sessionFactory.get(this.key_year);
    this.activatedRoute.params.subscribe((params) => {
      this.params = params;

      this.currentClass = this.params["class"];
      this.currentName = this.params["name"];

      this.dateFrom = this.params["from"] || this.dateToString(this.firstDayInPrevMonth());
      this.dateTo = this.params["to"] || this.dateToString(new Date());
      this.dateRange = new DateRange(this.dateFrom, this.dateTo).format();

      if (this.localeService) {
        // https://github.com/valor-software/ngx-bootstrap/issues/4054    
        this.localeService.use(zhCnLocale.abbr);
        this.daterangepickerconfig = {
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

  protected LogWarning = (msg: string) => {
    console.log(msg);
    this.toasterService.pop('warning', '', msg);
  };

  protected LogSuccess = (msg: string) => {
    console.log(msg);
    this.toasterService.pop('success', '', msg);
  };

  protected setclass(classId: number, className: string) {
    if (classId != this.currentClass) {
      this.currentClass = classId;
    };

    if (!classId) {
      this.searchcriteria.class = '班级';
    } else {
      this.searchcriteria.class = className;
    }
  }

  protected setpupil(pupilId: number, pupilName: string) {    
    if (pupilId != this.currentName) {
      this.currentName = pupilId;
    };

    if (!pupilId) {
      this.searchcriteria.name = '姓名';
    } else {
      this.searchcriteria.name = pupilName;
    }
  }

  setdate(date: string) {
    if (date != this.currentDate) {
      this.currentDate = date;
    };

    if (!date) {
      this.searchcriteria.date = '日期';
    } else {
      this.searchcriteria.date = date;
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

  protected filename(filename: string): string {
    return `${filename}.csv`;
  }

  protected dateToString(d: Date): string {
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  
  private stringToDate(d: string): Date {
    // yyyy/mm/dd or yyyy-mm-dd
    let segments = d.replace("/", "-").split("-");
    if (segments.length != 3) {
      throw 'invalid date';
    }

    let year = parseInt(segments[0]), month = parseInt(segments[1]) - 1 /* since month starts with 0 */, day = parseInt(segments[2]);
    return new Date(year, month, day);
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

  // https://stackoverflow.com/questions/48187362/how-to-iterate-using-ngfor-loop-map-containing-key-as-string-and-values-as-map-i
  protected getKeys(map: Map<number /** ID */, any>) {
    return Array.from(map.keys());
  }
  
  protected getValues(map: Map<number, any>) {
    return Array.from(map.values());
  }
}