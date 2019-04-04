import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from '../../components';
import { FileUploader } from 'ng2-file-upload';
import { ViewComponent } from '../base/view.component';
import { environment } from 'environments/environment';
import { ClassClient } from 'app/clients/class.client';
import { Classes } from 'app/models/class';

const classes_template = [
  {
    id: 1,
    class: "小一班",
  },
  {
    id: 2,
    class: "中二班",    
  },
  {
    id: 3,
    class: "大一班",
  },
  {
    id: 4,
    class: "大二班",
  },
];

@Component({  
  templateUrl: 'class.component.html',
  styleUrls: ['../../../scss/vendors/file-uploader/file-uploader.scss', '../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClassComponent extends ViewComponent implements OnInit {
  // user viewchild to get dom element by ref (#infoModal)
  @ViewChild('infoModal') infoModal

  fileUploader1: FileUploader = new FileUploader({});
  fileUploader2: FileUploader = new FileUploader({});
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  classes: Classes;
  filterQuery = '';

  constructor(private classClient: ClassClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected csvDownloader: AppCsvDownloadService, protected toasterService: ToasterService) {
    super(router, activatedRoute, csvDownloader, toasterService);
  }

  fileOverBase = (e) => {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1);
    this.initfileuploader(this.fileUploader2);
    this.getclasses();
  }

  initfileuploader(fileUploader: FileUploader) {    
    fileUploader.setOptions({
      url: environment.api.baseURI + '/classes',
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
      this.toasterService.pop('success', '', '上传班级信息成功');      
    };

    fileUploader.onErrorItem = (_, res) => {
      console.error(res);
      this.toasterService.pop('error', '', '上传班级信息失败，请重试');
    };

    fileUploader.onCompleteAll = () => {      
      this.infoModal.hide();
      this.getclasses();
    };
  }

  showupload() {    
    this.infoModal.show();    
  }

  getclasses() {    
    this.classClient.getClasses().
    subscribe(
      d => {        
        this.classes = new Classes(d.classes);
        if (this.classes.empty()) {
          this.infoModal.show();
          this.items = classes_template;
        } else {
          this.items = this.classes.classes;
        }
      },
      e => this.LogError(e, '获取班级信息失败，请重试'),
      () => this.LogComplete('"class management component classes loading completed"')
    );
  }
}
