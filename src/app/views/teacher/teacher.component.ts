import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from '../../components';
import { FileUploader } from 'ng2-file-upload';
import { NameClient } from '../../clients/name.client';
import { ViewComponent } from '../base/view.component';
import { FormattedTeacherList, TeacherList, TeacherListItem } from 'app/models/teacher';
import { environment } from 'environments/environment';

const teacherlist_template = [
  {
    id: 1,
    year: "2019",
    name: "陆美美",
    class: "中一班|中二班|中三班 (注:用'|'分割不同班级)",
    email: "12345@qq.com",
    role: "管理员 (注:有'管理员'权限的教师可以更新重要的系统数据，请谨慎选择。默认一般权限可以不填)",
  },
  {
    id: 2,
    year: "2019",
    name: "王莉莉",
    class: "大一班|中一班",
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
  @ViewChild('historyModal') historyModal

  fileUploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  teacherlist: FormattedTeacherList;
  filterQuery = '';
  years = [];
  currentYear = '';

  constructor(private nameClient: NameClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected csvDownloader: AppCsvDownloadService, protected toasterService: ToasterService) {
    super(router, activatedRoute, csvDownloader, toasterService);
  }

  fileOverBase = (e) => {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit(): void {
    this.fileUploader = new FileUploader({
      url: environment.api.baseURI + '/teacherlist',
      allowedMimeType: ['text/csv'],
      method: 'POST',
      autoUpload: true,
      authToken: `Bearer ${this.sessionFactory.get(this.key_token)}`,
      authTokenHeader: `Authorization`,
    });

    this.fileUploader.onProgressItem = () => {
      this.toasterService.pop('info', '', '上传中');
    };

    this.fileUploader.onSuccessItem = () => {
      this.toasterService.pop('success', '', '上传教师信息成功');      
    };

    this.fileUploader.onErrorItem = (_, res) => {
      console.error(res);
      this.toasterService.pop('error', '', '上传教师信息失败，请重试');
    };

    this.fileUploader.onCompleteAll = () => {      
      this.infoModal.hide();
      this.getteacherlist();
    };

    this.getteacherlist();
  }

  hasname() {
    return this.teacherlist && this.teacherlist.items.length > 0;
  }

  showhistory() {
    this.infoModal.hide();
    this.historyModal.show();
  }

  showupload() {
    this.historyModal.hide();
    this.infoModal.show();    
  }

  searchbynewyear(year: string) {
    if (year != this.currentYear) {
      this.currentYear = year;
    }
    this.getteacherlist();
    this.historyModal.hide();
  }  

  getteacherlist() {    
    this.nameClient.getTeacherlist(this.currentYear).
    subscribe(
      d => {        
        this.teacherlist = new TeacherList(d.items).FormattedTeacherList;
        if (!this.hasname()) {
          this.infoModal.show();
          this.items = teacherlist_template;
        } else {
          this.items = this.teacherlist.items;
          this.items.forEach(n => {
            if (!this.years.includes(n.year)) {
              this.years.push(n.year);
            }
          });
        }
      },
      e => this.LogError(e, '获取教师信息失败，请重试'),
      () => this.LogComplete('"class management component teacherlist loading completed"')
    );
  }

  edit(item: TeacherListItem, e: Event) {    
    e.preventDefault();
    // todo

  }

  get filename(): string {
    return `教师信息${this.currentYear ? '_' + this.currentYear + '学年' : ''}.csv`;
  }
}
