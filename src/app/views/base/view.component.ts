import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from 'app/components';
import { CsvFormat } from 'app/components/app-csv/app-csv-model';
import { SessionFactory, SessionConfig } from 'app/sessionstorage/sessionfactory.service';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { zhCnLocale, BsLocaleService, BsDatepickerConfig, ModalDirective } from 'ngx-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { DateRange, Constant } from 'app/models';
import { ViewChild, ElementRef } from '@angular/core';
import { environment } from 'environments/environment';
import { BaseComponent } from 'app/base.component';
import { AuthService } from 'app/services';

export abstract class ViewComponent extends BaseComponent {
  @ViewChild('infoModal', { static: false }) infoModal: ModalDirective
  @ViewChild('conditionModal', { static: false }) conditionModal: ModalDirective
  @ViewChild('explainModal', { static: false }) explainModal: ModalDirective

  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef

  loading: boolean;
  template: any[] = [];
  items: any[] = [];
  
  sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(Constant.SESSION_NAMESPACE, SessionFactory.DRIVERS.LOCAL));
  params: Object

  filterQuery = '';
  currentYear: string = '';
  currentClass: number; // class ID
  currentName: number; // pupil ID
  currentDate = '';
  dateFrom = '';
  dateTo = '';
  dateRange: Date[];
  daterangepickerconfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  classMap: Map<number, string> = new Map();
  pupilMap: Map<number, string> = new Map();

  searchcriteria = {
    year: '学年',
    class: '班级',
    name: '姓名',
    date: '日期',
  };

  csvDownloader: AppCsvDownloadService = new AppCsvDownloadService();

  fileUploader: FileUploader = new FileUploader({});
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;

  fileOverBase = (e) => {
    this.hasBaseDropZoneOver = e;
  }

  toasterconfig: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: true,
      timeout: 5000,
    });

  uploadFile() {
    this.fileUpload.nativeElement.click();
  }

  initfileuploader(fileUploader: FileUploader, endpoint: string, msg: string, callback?: Function, errcallback?: Function) {
    fileUploader.setOptions({
      url: `${environment.api.baseURI}/${endpoint}`,
      // allowedMimeType: ['text/csv'],
      method: 'POST',
      autoUpload: true,
      authToken: `Bearer ${this.sessionFactory.get(Constant.SESSION_KEY_IDTOKEN)}`,
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

    // https://github.com/valor-software/ng2-file-upload/issues/1018
    // https://github.com/valor-software/ng2-file-upload/issues/158
    // https://github.com/valor-software/ng2-file-upload/issues/220
    fileUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.fileUpload.nativeElement.value = '';
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
    this.currentYear = this.sessionFactory.get(Constant.SESSION_KEY_YEAR);
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

  showconditionsearch() {
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

  showupload() {
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

  showexplain() {
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

  DownloadCsv = (downloadtemplate: boolean, filename?: string, format?: CsvFormat) => {
    filename = filename || (window.location.hash.replace('#/', '') || (this.activatedRoute.component as any).name) + '.csv';
    let items = downloadtemplate ? this.template : this.items;
    this.csvDownloader.WriteFormattedCSV(items, format, filename);
  };

  LogComplete = (msg: string) => {
    console.log(msg);
  };

  LogError = (err: string, msg: string) => {
    console.error(err);
    this.toasterService.pop('error', '', msg);
  };

  LogWarning = (msg: string) => {
    console.log(msg);
    this.toasterService.pop('warning', '', msg);
  };

  LogSuccess = (msg: string) => {
    console.log(msg);
    this.toasterService.pop('success', '', msg);
  };

  setclass(classId: number, className: string) {
    if (classId != this.currentClass) {
      this.currentClass = classId;
    };

    if (!classId) {
      this.searchcriteria.class = '班级';
    } else {
      this.searchcriteria.class = className;
    }
  }

  setpupil(pupilId: number, pupilName: string) {
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

  setfrom(from: string) {
    if (from != this.dateFrom) {
      this.dateFrom = from;
    };
  }

  setto(to: string) {
    if (to != this.dateTo) {
      this.dateTo = to;
    };
  }

  filename(filename: string): string {
    return `${filename}.csv`;
  }

  dateToString(d: Date): string {
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

  firstDayInPrevMonth(): Date {
    let d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    return d;
  }

  monday(): Date {
    let d = new Date();
    let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  friday(): Date {
    let monday = this.monday(),
      diff = monday.getDate() + 4;
    return new Date(monday.setDate(diff));
  }

  // https://stackoverflow.com/questions/48187362/how-to-iterate-using-ngfor-loop-map-containing-key-as-string-and-values-as-map-i
  getKeys(map: Map<number /** ID */, any>) {
    return Array.from(map.keys());
  }

  getValues(map: Map<number, any>) {
    return Array.from(map.values());
  }
}