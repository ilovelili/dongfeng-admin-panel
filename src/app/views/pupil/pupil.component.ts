import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { PupilClient } from 'app/clients';
import { Pupil } from 'app/models';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from 'app/services/auth.service';

@Component({
  templateUrl: './pupil.component.html',
  styleUrls: [
    '../../../scss/vendors/file-uploader/file-uploader.scss',
    '../../../scss/vendors/toastr/toastr.scss',
    './pupil.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PupilComponent extends ViewComponent implements OnInit {
  pupils: Pupil[];
  constructor(private pupilClient: PupilClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader, 'pupils', '幼儿');
    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getpupils();
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      });

    this.template = [
      {
        id: 1,
        year: 2019,
        class: "小一班",
        name: "王子涵"
      },
      {
        id: 2,
        year: 2019,
        class: "小二班",        
        name: "张梓轩"
      },
      {
        id: 3,
        year: 2019,
        class: "小三班",
        name: "李雨轩"
      }
    ];
  }

  getpupils() {
    this.loading = true;
    this.pupilClient.getPupils(this.currentYear, this.currentClass).
      subscribe(
        d => {
          this.loading = false;
          this.conditionModal.hide();

          this.pupils = d.map(p => {
            let _pupil = new Pupil();
            _pupil.id = p.id;
            _pupil.class = p.class;
            _pupil.name = p.name;
            return _pupil;
          });

          if (!this.pupils.length) {
            if (this.isAdmin) {
              this.infoModal.show();
            } else {
              this.LogWarning("没有幼儿信息");
            }            
            this.items = this.template;
          } else {
            this.items = this.pupils;
            this.items.forEach((p: Pupil) => {
              if (!this.classMap.has(p.class.id)) {
                this.classMap.set(p.class.id, p.class.name);
              }
            });
          }
        },
        e => this.LogError(e, '获取幼儿信息失败，请重试'),
        () => this.LogComplete('pupil component pupils loading completed')
      );
  }
}
