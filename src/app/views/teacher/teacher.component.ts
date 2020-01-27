import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Teachers, Teacher, ErrorCode } from 'app/models';
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
  teachers: Teachers;  

  constructor(private classClient: ClassClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
  }

  ngOnInit(): void {    
    this.initfileuploader(this.fileUploader1, 'teachers', '教师', null, this.errorcallback);
    this.initfileuploader(this.fileUploader2, 'teachers', '教师', null, this.errorcallback);
    this.getteachers();

    this.template = [
      {
        id: 1,
        year: "2019",
        name: "陆美美",
        class: "小一班|中二班|大一班 (注:用'|'分割不同班级)",
        email: "12345@qq.com",
        role: "管理员 (注:有'管理员'权限的教师可以更新重要的系统数据，请谨慎选择。)",
      },
      {
        id: 2,
        year: "2019",
        name: "王莉莉",
        class: "大一班|中二班",
        email: "54321@163.com",
        role: "教师",
      },
      {
        id: 3,
        year: "2018",
        name: "陆美美",
        class: "大三班",
        email: "12345@qq.com",
        role: "管理员",
      }
    ];
  }  

  getteachers(showinfomodal: boolean = true) {
    this.loading = true;
    this.classClient.getTeachers(this.currentYear, this.currentClass).
    subscribe(
      d => {
        this.loading = false;
        this.conditionModal.hide();

        this.teachers = new Teachers(d.teachers);
        if (this.teachers.empty()) {
          if (showinfomodal) {
            this.infoModal.show();
            this.items = this.template;
          } else {
            this.LogWarning('没有教师信息');
          }
        } else {
          this.items = this.teachers.teachers;
          this.items.forEach(n => {
            if (!this.years.includes(n.year)) {
              this.years.push(n.year);
            }
            
            let class_segments = (<Teacher>n).class.split('|');
            class_segments.forEach((s: string) => {
              if (!this.classes.includes(s)) {  
                this.classes.push(s);
              }
            });
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
          this.loading = false;          
        },
        e => {
          if (e.error.custom_code == ErrorCode.InvalidClass) {
            this.LogError(e, '教师信息更新失败，请检查班级名');
          } else {
            this.LogError(e, '教师信息更新失败，请重试');
          }
          this.loading = false;
          // revert
          let idx = this.items.findIndex(i => i.id == item.id);
          this.items[idx] = (<any>item).original;
        },
        () => this.LogComplete('teacher component teacher updating completed')
      );
  }

  errorcallback(res: string, me: any) {
    let resjson = JSON.parse(res);
    if (resjson.custom_code == ErrorCode.InvalidClass) {
      me.LogError(res, '教师信息更新失败，请检查班级名');
    } else {
      me.LogError(res, '教师信息更新失败，请重试');
    }
  }
}
