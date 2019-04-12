import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from '../../components';
import { FileUploader } from 'ng2-file-upload';
import { ViewComponent } from '../base/view.component';
import { environment } from 'environments/environment';
import { ClassClient } from 'app/clients/class.client';
import { Attendances, FormattedAttendance } from 'app/models/attendance';
import { AttendanceClient } from 'app/clients/attendance.client';
import { Pupils } from 'app/models/pupil';

const attendances_template = [
  {
    id: 1,
    year: "2019",
    date: "2019-04-01 (注:日期为 年-月-日 或者 年/月/日 格式)",
    class: "小一班",
    name: "王子涵 (注:只需上传出勤园儿名单,缺席园儿可以不记录或者在出勤栏中填入 x)",
    attendance: "",
  },
  {
    id: 2,
    year: "2019",
    date: "2019-04-01",
    class: "小一班",
    name: "赵欣怡",
    attendance: "",
  },
  {
    id: 3,
    year: "2019",
    date: "2019-04-02",
    class: "小一班",
    name: "王子涵 (注: 2019-04-02 没有赵欣怡的记录， 即赵欣怡缺席",
    attendance: "",
  },
  {
    id: 4,
    year: "2019",
    date: "2019-04-02",
    class: "大一班",
    name: "李雨轩",
    attendance: "",
  },
  {
    id: 5,
    year: "2019",
    date: "2019-04-03",
    class: "小一班",
    name: "赵欣怡",
    attendance: "x (注: 出席栏用 x 也可表示缺席, x 以外的符号都认为是出勤)",
  },
  {
    id: 6,
    year: "2019",
    date: "2019-04-03",
    class: "大一班",
    name: "李雨轩",
    attendance: "",
  },
];

@Component({
  templateUrl: 'attendance.component.html',
  styleUrls: ['../../../scss/vendors/file-uploader/file-uploader.scss', '../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AttendanceComponent extends ViewComponent implements OnInit {
  // user viewchild to get dom element by ref (#infoModal)
  @ViewChild('infoModal') infoModal
  @ViewChild('conditionModal') conditionModal

  fileUploader1: FileUploader = new FileUploader({});
  fileUploader2: FileUploader = new FileUploader({});
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  attendances: FormattedAttendance[];
  filterQuery = '';
  years = [];
  classes = [];
  currentYear = '';
  currentClass = '';
  currentName = '';
  dateFrom = '';
  dateTo = '';

  constructor(private classClient: ClassClient, private attendanceClient: AttendanceClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected csvDownloader: AppCsvDownloadService, protected toasterService: ToasterService) {
    super(router, activatedRoute, csvDownloader, toasterService);
    this.currentClass = this.params["class"];
    this.currentName = this.params["year"];
    this.dateFrom = this.params["from"];
    this.dateTo = this.params["to"];
  }

  fileOverBase = (e) => {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1);
    this.initfileuploader(this.fileUploader2);    
    this.getattendances();
  }

  initfileuploader(fileUploader: FileUploader) {
    fileUploader.setOptions({
      url: environment.api.baseURI + '/attendances',
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
      this.toasterService.pop('success', '', '上传出勤信息成功');
    };

    fileUploader.onErrorItem = (_, res) => {
      console.error(res);
      this.toasterService.pop('error', '', '上传出勤信息失败，请重试');
    };

    fileUploader.onCompleteAll = () => {
      this.infoModal.hide();
      this.getattendances();
    };
  }

  showconditionsearch() {
    this.infoModal.hide();
    this.conditionModal.show();
  }

  showupload() {
    this.conditionModal.hide();
    this.infoModal.show();
  }

  searchbynewyear(year: string, from?: string, to?: string) {
    this.searchby(() => {
      if (year != this.currentYear) {
        this.currentYear = year;
      }
    }, from, to);
  }

  searchbyclass(cls: string, from?: string, to?: string) {
    this.searchby(() => {
      if (cls != this.currentClass) {
        this.currentClass = cls;
      };
    }, from, to);
  }

  searchbyname(name: string, from?: string, to?: string) {
    this.searchby(() => {
      if (name != this.currentName) {
        this.currentName = name;
      };
    }, from, to);
  }

  searchby(criteria: () => void, from?: string, to?: string) {
    criteria();
    if (from) {
      this.dateFrom = from;
    }
    if (to) {
      this.dateTo = to;
    }

    this.getattendances();
    this.conditionModal.hide();
  }

  getattendances() {
    this.classClient.getPupils(this.currentYear, this.currentClass).
      subscribe(
        d => {
          let namelist = new Pupils(d.pupils);
          this.attendanceClient.getAttendances(this.currentYear, this.currentClass, this.currentName, this.dateFrom, this.dateTo).
            subscribe(
              d => {
                this.attendances = new Attendances(d.attendances, namelist).format();
                if (this.attendances.length == 0) {
                  this.infoModal.show();
                  this.items = attendances_template;
                } else {
                  this.items = this.attendances;
                  this.items.forEach(n => {
                    if (!this.years.includes(n.year)) {
                      this.years.push(n.year);
                    }
                    if (!this.classes.includes(n.class)) {
                      this.classes.push(n.class);
                    }
                  });
                }
              },
              e => this.LogError(e, '获取出勤信息失败，请重试'),
              () => this.LogComplete('"class component teachers loading completed"')
            );
        },
        e => this.LogError(e, '获取出勤信息失败，请重试'),
        () => this.LogComplete('"pupil component pupils loading completed"')
      );
  }

  edit(item: FormattedAttendance, e: Event) {
    e.preventDefault();
    // todo

  }

  get filename(): string {
    return `出勤信息${this.currentClass ? '_' + this.currentClass : ''}${this.currentYear ? '_' + this.currentYear + '学年' : ''}${this.currentName ? '_' + this.currentName : ''}${this.dateFrom ? '_' + this.dateFrom : ''}${this.dateTo ? '_' + this.dateTo : ''}.csv`;
  }
}
