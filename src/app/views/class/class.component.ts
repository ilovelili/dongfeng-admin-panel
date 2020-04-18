import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ClassClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from 'app/services/auth.service';
import { Class } from 'app/models';

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
  classes: Class[] = [];
  constructor(private classClient: ClassClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader, 'classes', '班级');    
    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getclasses();
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      });

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
            if (this.isAdmin) {
              this.infoModal.show();
            } else {
              this.LogWarning("没有班级信息");
            }
            this.items = this.template;
          } else {
            this.classes = d;
            this.items = d;
          }
        },
        e => this.LogError(e, '获取班级信息失败，请重试'),
        () => this.LogComplete('class component classes loading completed')
      );
  }
}
