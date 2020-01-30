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
    this.initfileuploader(this.fileUploader1, 'pupils', '园儿');
    this.initfileuploader(this.fileUploader2, 'pupils', '园儿');
    this.getpupils();

    this.template = [
      {
        id: 1,
        classId: 1,
        class: {
          id: 1,
          name: "小一班",
        },
        name: "王子涵"
      },
      {
        id: 2,
        classId: 2,
        class: {
          id: 2,
          name: "小二班",
        },
        name: "张梓轩"
      },
      {
        id: 3,
        classId: 3,
        class: {
          id: 3,
          name: "小三班",
        },
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
            this.infoModal.show();
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
        e => this.LogError(e, '获取园儿信息失败，请重试'),
        () => this.LogComplete('pupil component pupils loading completed')
      );
  }
}
