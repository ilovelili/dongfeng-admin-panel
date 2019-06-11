import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { AttendanceClient } from 'app/clients';
import { Attendances, FormattedAttendance, Holidays } from 'app/models';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from 'app/auth/auth.service';

@Component({
  templateUrl: './attendance.component.html',
  styleUrls: [
    '../../../scss/vendors/file-uploader/file-uploader.scss',
    '../../../scss/vendors/toastr/toastr.scss',
    '../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    './attendance.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AttendanceComponent extends ViewComponent implements OnInit {
  attendances: FormattedAttendance[];

  constructor(private attendanceClient: AttendanceClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService, protected localeService: BsLocaleService) {
    super(router, authService, activatedRoute, toasterService, localeService);
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'attendances', '出勤');
    this.initfileuploader(this.fileUploader2, 'attendances', '出勤');
    this.getattendances();

    this.template = [
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
          this.conditionModal.hide();

          if (this.attendances.length == 0) {
            if (showinfomodal) {
              this.infoModal.show();
              this.items = this.template;
            } else {
              this.LogWarning('没有出勤信息');
            }
          } else {
            this.items = this.attendances;
            this.items.forEach(a => {
              if (a.year && !this.years.includes(a.year)) {                
                this.years.push(a.year);
              }
              if (a.class && !this.classes.includes(a.class)) {
                this.classes.push(a.class);
              }
            });
          }
        },
        e => this.LogError(e, '获取出勤信息失败，请重试'),
        () => this.LogComplete('attendance component attendences loading completed')
      );
  }

  updateattendance(item: FormattedAttendance, e: Event) {
    e.preventDefault();
    // this.loading = true;
    let original = item.attendance;

    // toggle attendence
    if (original == "o") {
      item.attendance = "x";
    } else if (original == "x") {
      item.attendance = "o";
    }

    this.attendanceClient.updateAttendance(item).
      subscribe(
        _ => {
          this.LogSuccess('出勤信息更新');
          // this.loading = false;
        },
        e => {
          this.LogError(e, '出勤信息更新失败，请重试');
          // this.loading = false;
          item.attendance = original;
        },
        () => this.LogComplete('attendance component attendence upload completed')
      );
  }

  get names() {
    let result = [];

    this.items.filter(i => {
      let filterres = true;
      if (this.currentYear) {
        filterres = filterres && i.year == this.currentYear;
      }
      if (this.currentClass) {
        filterres = filterres && i.class == this.currentClass;
      }
      return filterres;
    }).map(i => i.name).forEach(n => {
      if (n && !result.includes(n)) {
        result.push(n);
      }
    });

    return result;
  }
}
