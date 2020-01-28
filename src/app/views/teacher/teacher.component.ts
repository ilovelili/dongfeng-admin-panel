import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Teacher, ErrorCode } from 'app/models';
import { ClassClient } from 'app/clients';
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

  constructor(private classClient: ClassClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
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
        classId: 1,
        class: {
          id: 1,
          name: "小一班",
        },
        name: "陆美美",
        email: "12345@qq.com"
      },
      {
        id: 2,
        classId: 2,
        class: {
          id: 2,
          name: "小二班",
        },
        name: "王丽丽",
        email: "54321@163.com"
      },
      {
        id: 3,
        classId: 3,
        class: {
          id: 3,
          name: "小三班",
        },
        name: "陆美丽",
        email: "abcde@qq.com"
      }
    ];
  }

  getteachers() {
    this.loading = true;
    this.classClient.getTeachers(this.currentYear, this.currentClass).
      subscribe(
        d => {
          this.loading = false;
          this.conditionModal.hide();

          if (!d.length) {
            this.infoModal.show();
            this.items = this.template;
          } else {
            this.teachers = d.map(t => {
              let _teacher = new Teacher();
              _teacher.id = t.id;
              _teacher.name = t.name;
              _teacher.email = t.email;
              _teacher.user = t.user;
              _teacher.class = t.class;
              return _teacher;
            });

            this.items = this.teachers;
            this.items.forEach(n => {
              if (!this.classes.includes(n.className)) {
                this.classes.push(n.className);
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
    this.classClient.updateTeacher(item).
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
