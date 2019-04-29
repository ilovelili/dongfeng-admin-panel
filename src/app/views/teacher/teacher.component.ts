import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Teachers, Teacher } from 'app/models/teacher';
import { ClassClient } from 'app/clients/class.client';
import { ToasterService } from 'angular2-toaster';

const teachers_template = [
  {
    id: 1,
    year: "2019",
    name: "陆美美",
    class: "小一班|中二班|大一班 (注:用'|'分割不同班级)",
    email: "12345@qq.com",
    role: "管理员 (注:有'管理员'权限的教师可以更新重要的系统数据，请谨慎选择。默认一般权限可以不填)",
  },
  {
    id: 2,
    year: "2019",
    name: "王莉莉",
    class: "大一班|中二班",
    email: "54321@163.com",
    role: "",
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

  constructor(private classClient: ClassClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }

  ngOnInit(): void {    
    this.initfileuploader(this.fileUploader1, 'teachers', '教师');
    this.initfileuploader(this.fileUploader2, 'teachers', '教师');
    this.getteachers();
  }  

  getteachers(showinfomodal: boolean = true) {
    this.loading = true;
    this.classClient.getTeachers(this.currentYear, this.currentClass).
    subscribe(
      d => {
        this.loading = false;
        this.teachers = new Teachers(d.teachers).format();
        if (this.teachers.empty() && showinfomodal) {
          this.infoModal.show();
          this.items = teachers_template;
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
      () => this.LogComplete('class component teachers loading completed')
    );
  }

  edit(item: Teacher, e: Event) {    
    e.preventDefault();
    // todo
  }
}
