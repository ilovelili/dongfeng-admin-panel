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
        date: "2020-04-11 (注:日期为 年-月-日 格式)",
        pupilId: 1,
      },
      {
        id: 2,
        date: "2020-04-12",
        pupilId: 2,
      },
      {
        id: 3,
        date: "2020-09-02",
        pupilId: 12
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
            if (showmodal) {
              this.infoModal.show();
              this.items = this.template;
            } else {
              this.LogWarning("没有数据")
            }            
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
}
