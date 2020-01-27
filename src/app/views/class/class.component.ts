import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ClassClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from 'app/services/auth.service';

@Component({
  templateUrl: './class.component.html',
  styleUrls: [
    '../../../scss/vendors/file-uploader/file-uploader.scss',
    '../../../scss/vendors/toastr/toastr.scss',
    './class.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ClassComponent extends ViewComponent implements OnInit {
  constructor(private classClient: ClassClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'classes', '班级');
    this.initfileuploader(this.fileUploader2, 'classes', '班级');
    this.getclasses();

    this.template = [
      {
        id: 1,
        class: "小一班",
        year: 2019
      },
      {
        id: 2,
        class: "中二班",
        year: 2019
      },
      {
        id: 3,
        class: "大一班",
        year: 2019
      },
      {
        id: 4,
        class: "大二班",
        year: 2019
      },
    ];
  }

  getclasses() {
    this.loading = true;
    this.classClient.getClasses().
      subscribe(
        d => {
          this.loading = false;

          if (!d.length) {
            this.found = false;
            this.infoModal.show();
            this.items = this.template;
          } else {            
            this.items = d;
          }
        },
        e => this.LogError(e, '获取班级信息失败，请重试'),
        () => this.LogComplete('class component classes loading completed')
      );
  }
}
