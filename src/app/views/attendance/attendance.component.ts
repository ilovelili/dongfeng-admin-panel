import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { AttendanceClient } from 'app/clients/attendance.client';
import { Attendances, FormattedAttendance, Holidays } from 'app/models';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';

const absences_template = [
  {
    id: 1,
    year: "2019",
    date: "2019-04-01 (注:日期为 年-月-日 或者 年/月/日 格式)",
    class: "小一班",
    name: "王子涵 (注:只需上传缺席园儿名单,出席园儿不必记录)",
  },
  {
    id: 2,
    year: "2019",
    date: "2019-04-01",
    class: "小一班",
    name: "赵欣怡",
  },
  {
    id: 3,
    year: "2019",
    date: "2019-04-02",
    class: "小一班",
    name: "王子涵",
  },
  {
    id: 4,
    year: "2019",
    date: "2019-04-02",
    class: "大一班",
    name: "李雨轩",
  },
  {
    id: 5,
    year: "2019",
    date: "2019-04-03",
    class: "小一班",
    name: "赵欣怡",
  },
  {
    id: 6,
    year: "2019",
    date: "2019-04-03",
    class: "大一班",
    name: "李雨轩",
  },
];

@Component({
  templateUrl: 'attendance.component.html',
  styleUrls: [
    '../../../scss/vendors/file-uploader/file-uploader.scss',
    '../../../scss/vendors/toastr/toastr.scss',
    '../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    'attendance.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AttendanceComponent extends ViewComponent implements OnInit {
  attendances: FormattedAttendance[];

  constructor(private attendanceClient: AttendanceClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService, protected localeService: BsLocaleService) {
    super(router, activatedRoute, toasterService, localeService);
  }  

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'attendances', '出勤', this.getattendances);
    this.initfileuploader(this.fileUploader2, 'attendances', '出勤', this.getattendances);
    this.getattendances();
  }

  getattendances(showinfomodal: boolean = true) {
    this.loading = true;
    this.dateFrom = this.formatDate(this.dateRange[0]);
    this.dateTo = this.formatDate(this.dateRange[1]);
    this.attendanceClient.getAttendances(this.currentYear, this.currentClass, this.currentName, this.dateFrom, this.dateTo).
      subscribe(
        d => {
          this.loading = false;
          this.attendances = new Attendances(d.attendances, new Holidays(d.holidays)).format();
          if (this.attendances.length == 0 && showinfomodal) {
            this.infoModal.show();
            this.items = absences_template;
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
  }

  edit(item: FormattedAttendance, e: Event) {
    e.preventDefault();
    // todo
  }  
}
