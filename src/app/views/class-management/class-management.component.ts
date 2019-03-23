import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { User } from '../../models';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from '../../components';
import { FileUploader } from 'ng2-file-upload';
import { NameClient } from '../../clients/name.client';
import { FormattedNameList } from '../../models/name';
import { environment } from '../../../environments/environment';
import { ViewComponent } from '../base/view.component';

@Component({
  providers: [User],
  templateUrl: 'class-management.component.html',
  styleUrls: ['../../../scss/vendors/file-uploader/file-uploader.scss', '../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClassManagementComponent extends ViewComponent implements OnInit {
  // user viewchild to get dom element by ref (#infoModal)
  @ViewChild('infoModal') modal

  fileUploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  namelist: FormattedNameList;

  constructor(private nameClient: NameClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected csvDownloader: AppCsvDownloadService, protected toasterService: ToasterService) {
    super(router, activatedRoute, csvDownloader, toasterService);
  }

  fileOverBase = (e) => {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit(): void {
    this.fileUploader = new FileUploader({
      url: environment.api.baseURI + '/namelist',
      method: 'POST',
      autoUpload: true,
      authToken: "Authorization",
      authTokenHeader: `Bearer ${this.sessionFactory.get(this.key_token)}`,
    });

    this.fileUploader.onCompleteItem = () => {
      this.toasterService.pop('success', '', '上传名单信息成功');
    };

    this.fileUploader.onErrorItem = () => {
      this.toasterService.pop('error', '', '上传名单信息失败，请重试');
    };

    this.nameClient.getNamelist().
      subscribe(
        d => {
          this.namelist = d.FormattedNameList;
          if (!this.hasname()) {
            this.modal.show();
          }
        },
        e => this.LogError(e, '获取名单信息失败，请重试'),
        () => this.LogComplete('"class management component namelist loading completed"')
      );
  }

  hasname() {
    return this.namelist && this.namelist.items.length > 0;
  }
}
