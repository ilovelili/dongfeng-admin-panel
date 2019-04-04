import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from '../../components';
import { FileUploader } from 'ng2-file-upload';
import { ViewComponent } from '../base/view.component';
import { environment } from 'environments/environment';
import { ClassList } from 'app/models/class';
import { ClassClient } from 'app/clients/class.client';

const classlist_template = [
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

  fileUploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  classlist: ClassList;
  filterQuery = '';

  constructor(private classClient: ClassClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected csvDownloader: AppCsvDownloadService, protected toasterService: ToasterService) {
    super(router, activatedRoute, csvDownloader, toasterService);
  }

  fileOverBase = (e) => {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit(): void {
    this.fileUploader = new FileUploader({
      url: environment.api.baseURI + '/classlist',
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
      this.toasterService.pop('success', '', '上传班级信息成功');      
    };

    this.fileUploader.onErrorItem = (_, res) => {
      console.error(res);
      this.toasterService.pop('error', '', '上传班级信息失败，请重试');
    };

    this.fileUploader.onCompleteAll = () => {      
      this.infoModal.hide();
      this.getclasslist();
    };

    this.getclasslist();
  }

  hasclass() {
    return this.classlist && this.classlist.items && this.classlist.items.length > 0;
  }  

  showupload() {    
    this.infoModal.show();    
  }

  getclasslist() {    
    this.classClient.getClasslist().
    subscribe(
      d => {        
        this.classlist = new ClassList(d.items);
        if (!this.hasclass()) {
          this.infoModal.show();
          this.items = classlist_template;
        } else {
          this.items = this.classlist.items;          
        }
      },
      e => this.LogError(e, '获取班级信息失败，请重试'),
      () => this.LogComplete('"class management component classlist loading completed"')
    );
  }
}
