import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Teacher } from 'app/models';
import { TeacherClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from 'app/services/auth.service';

@Component({
  templateUrl: './teacher.component.html',
  styleUrls: [
    '../../../scss/vendors/file-uploader/file-uploader.scss',
    '../../../scss/vendors/toastr/toastr.scss',
    './teacher.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TeacherComponent extends ViewComponent implements OnInit {
  teachers: Teacher[];

  constructor(private teacherClient: TeacherClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'teachers', '教师');
    this.initfileuploader(this.fileUploader2, 'teachers', '教师');
    this.getteachers();

    this.template = [
      {
        id: 1,        
        email: "12345@qq.com",
        year: 2019,
        class: "小一班",
        name: "陆美美"
      },
      {
        id: 2,
        email: "54321@163.com",
        year: 2019,
        class: "小二班",
        name: "王丽丽"
      },
      {
        id: 3,
        email: "abcde@qq.com",
        year: 2019,
        class: "小三班",
        name: "陆美丽"
      }
    ];
  }

  getteachers() {
    this.loading = true;
    this.teacherClient.getTeachers(this.currentYear, this.currentClass).
      subscribe(
        d => {
          this.loading = false;
          this.conditionModal.hide();

          if (!d.length) {
            if (this.isAdmin) {
              this.infoModal.show();
            } else {
              this.LogWarning("没有教师信息");
            }
          } else {
            this.teachers = d.map(t => {
              let _teacher = new Teacher();
              _teacher.id = t.id;
              _teacher.name = t.name;
              _teacher.email = t.email;
              _teacher.user = t.user;
              _teacher.class = t.class;
              _teacher.class_id = t.class_id;
              return _teacher;
            });

            this.items = this.teachers;
            this.items.forEach((t: Teacher) => {
              if (!t.class) {
                // skip
              } else if (!this.classMap.has(t.class.id)) {
                this.classMap.set(t.class.id, t.class.name);
              }
            });
          }
        },
        e => this.LogError(e, '获取教师信息失败，请重试'),
        () => this.LogComplete('teacher component teachers loading completed')
      );
  }

  updateteacher(item: Teacher) {
    this.loading = true;
    this.teacherClient.updateTeacher(item).
      subscribe(
        _ => {
          this.LogSuccess('教师信息更新');
          this.getteachers();
        },
        e => {
          this.LogError(e, '教师信息更新失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('teacher component teacher updating completed')
      );
  }
}
