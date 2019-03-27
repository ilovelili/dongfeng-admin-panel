import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { User } from '../../models';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from '../../components';
import { FileUploader } from 'ng2-file-upload';
import { NameClient } from '../../clients/name.client';
import { FormattedNameList, NameList } from '../../models/name';
import { environment } from '../../../environments/environment';
import { ViewComponent } from '../base/view.component';

const namelist_template = [
  {
    id: 1,
    year: "2019",
    class: "小一班",
    name: "王子涵"
  },
  {
    id: 2,
    year: "2019",
    class: "中二班",
    name: "张梓轩"
  },
  {
    id: 3,
    year: "2019",
    class: "大三班",
    name: "李雨轩"
  },
  {
    id: 4,
    year: "2019",
    class: "小一班",
    name: "赵欣怡"
  },
];

@Component({
  providers: [User],
  templateUrl: 'class.component.html',
  styleUrls: ['../../../scss/vendors/file-uploader/file-uploader.scss', '../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClassComponent extends ViewComponent implements OnInit {
  // user viewchild to get dom element by ref (#infoModal)
  @ViewChild('infoModal') infoModal
  @ViewChild('historyModal') historyModal

  fileUploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  namelist: FormattedNameList;
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
      url: environment.api.baseURI + '/namelist',
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
      this.toasterService.pop('success', '', '上传名单信息成功');      
    };

    this.fileUploader.onErrorItem = (_, res) => {
      console.error(res);
      this.toasterService.pop('error', '', '上传名单信息失败，请重试');
    };

    this.fileUploader.onCompleteAll = () => {      
      this.infoModal.hide();
      this.getnamelist();
    };

    this.getnamelist();
  }

  hasname() {
    return this.namelist && this.namelist.items.length > 0;
  }

  showhistory() {
    this.historyModal.show();
  }

  searchbynewyear(year: string) {
    if (year != this.currentYear) {
      this.currentYear = year;
    }
    this.getnamelist();
    this.historyModal.hide();
  }

  getnamelist() {    
    this.nameClient.getNamelist(this.currentYear).
    subscribe(
      d => {        
        this.namelist = new NameList(d.items).FormattedNameList;
        if (!this.hasname()) {
          this.infoModal.show();
          this.items = namelist_template;
        } else {
          this.items = this.namelist.items;
          this.items.forEach(n => {
            if (!this.years.includes(n.year)) {
              this.years.push(n.year);
            }
          });
        }
      },
      e => this.LogError(e, '获取名单信息失败，请重试'),
      () => this.LogComplete('"class management component namelist loading completed"')
    );
  }
}
