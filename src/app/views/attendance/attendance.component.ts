import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { AttendanceClient } from 'app/clients';
import { FormattedAttendance, Attendance, Class } from 'app/models';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from 'app/services/auth.service';

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
  classPupilMap: Map<number, Map<number, string>> = new Map(); // classID and pupil 1 => n map
  attendances: FormattedAttendance[];
  displayMode = 'all';

  constructor(private attendanceClient: AttendanceClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService, protected localeService: BsLocaleService) {
    super(router, authService, activatedRoute, toasterService, localeService);
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader, 'attendances', '出勤');
    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getattendances();
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      });

    this.template = [
      {
        id: 1,
        year: 2009,
        date: "2020-01-31 (注:日期为 年-月-日 格式)",
        class: "大一班",
        name: "居翼"
      },
      {
        id: 2,
        year: 2009,
        date: "2020-02-01",
        class: "大一班",
        name: "居翼"
      },
    ];
  }

  getattendances(showmodal: boolean = true) {
    this.loading = true;
    this.dateFrom = this.dateToString(this.dateRange[0]);
    this.dateTo = this.dateToString(this.dateRange[1]);
    this.attendanceClient.getAttendances(this.currentYear, this.currentClass, this.currentName, this.dateFrom, this.dateTo).
      subscribe(
        d => {
          this.conditionModal.hide();
          if (!d.length) {
            if (this.isAdmin) {
              this.infoModal.show();
            } else {
              this.LogWarning("没有出勤信息");
            }
            this.items = this.template;
          } else {
            this.attendances = Attendance.sort(d.map((a: Attendance) => {
              let _attendance = new Attendance();
              _attendance.date = a.date;
              _attendance.absent = a.absent;
              _attendance.pupil = a.pupil;
              _attendance.holiday = a.holiday;

              return _attendance.format();
            }));

            this.items = this.attendances;
            this.items.forEach((a: FormattedAttendance) => {
              if (!isNaN(a.classId) && !this.classMap.has(a.classId)) {
                this.classMap.set(a.classId, a.class);
              }
            });
          }

          this.loading = false;
        },
        e => this.LogError(e, '获取出勤信息失败，请重试'),
        () => this.LogComplete('attendance component attendences loading completed')
      );
  }

  updateattendance(item: FormattedAttendance, e: Event) {
    e.preventDefault();
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
        },
        e => {
          this.LogError(e, '出勤信息更新失败，请重试');
          item.attendance = original;
        },
        () => this.LogComplete('attendance component attendence upload completed')
      );
  }

  get filteredPupilMap() {
    let pupils = this.items.
      filter(a => a.classId == this.currentClass).
      map(a => { return { key: a.pupilId, value: a.name } });

    // remove duplicates
    let distincts = {};
    pupils.forEach(p => {
      distincts[p.key] = p.value;
    })

    let results = [];
    for (var key in distincts) {
      results.push({
        key: key,
        value: distincts[key],
      });
    }
    return results;
  }

  displayall() {
    this.displayMode = 'all';
  }

  displayworkingday() {
    this.displayMode = 'workingday';
  }

  get filteredItems(): FormattedAttendance[] {
    if (this.displayMode == 'workingday') {
      return this.items.filter((i: FormattedAttendance) => i.isWorkingDay);
    } else {
      return this.items;
    }    
  }
}
