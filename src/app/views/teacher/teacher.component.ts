import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from '../../components';
import { FileUploader } from 'ng2-file-upload';
import { ViewComponent } from '../base/view.component';
import { environment } from 'environments/environment';
import { Teachers, Teacher } from 'app/models/teacher';
import { ClassClient } from 'app/clients/class.client';

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
  templateUrl: 'teacher.component.html',
  styleUrls: ['../../../scss/vendors/file-uploader/file-uploader.scss', '../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TeacherComponent extends ViewComponent implements OnInit {
  // user viewchild to get dom element by ref (#infoModal)
  @ViewChild('infoModal') infoModal
  @ViewChild('conditionModal') conditionModal

  fileUploader1: FileUploader = new FileUploader({});
  fileUploader2: FileUploader = new FileUploader({});
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  teachers: Teachers;
  filterQuery = '';
  years = [];  
  classes = [];
  currentYear = '';
  currentClass = '';

  constructor(private classClient: ClassClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected csvDownloader: AppCsvDownloadService, protected toasterService: ToasterService) {
    super(router, activatedRoute, csvDownloader, toasterService);
    this.currentClass = this.params["class"];
  }

  fileOverBase = (e) => {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit(): void {    
    this.initfileuploader(this.fileUploader1);
    this.initfileuploader(this.fileUploader2);
    this.getteachers();
  }

  initfileuploader(fileUploader: FileUploader) {
    fileUploader.setOptions({
      url: environment.api.baseURI + '/teachers',
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
      this.toasterService.pop('success', '', '上传教师信息成功');      
    };

    fileUploader.onErrorItem = (_, res) => {
      console.error(res);
      this.toasterService.pop('error', '', '上传教师信息失败，请重试');
    };

    fileUploader.onCompleteAll = () => {      
      this.infoModal.hide();
      this.getteachers();
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

  searchbynewyear(year: string) {
    if (year != this.currentYear) {
      this.currentYear = year;
    }
    this.getteachers();
    this.conditionModal.hide();
  }

  searchbyclass(cls: string) {
    if (cls != this.currentClass) {
      this.currentClass = cls;
    }
    this.getteachers();
    this.conditionModal.hide();
  }

  getteachers() {    
    this.classClient.getTeachers(this.currentYear, this.currentClass).
    subscribe(
      d => {        
        this.teachers = new Teachers(d.teachers).format();
        if (this.teachers.empty()) {
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
      () => this.LogComplete('"class component teachers loading completed"')
    );
  }

  edit(item: Teacher, e: Event) {    
    e.preventDefault();
    // todo

  }

  get filename(): string {
    return `教师信息${this.currentClass ? '_' + this.currentClass : ''}${this.currentYear ? '_' + this.currentYear + '学年' : ''}.csv`;
  }
}
