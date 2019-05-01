import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ClassClient } from 'app/clients/class.client';
import { Pupils, Pupil } from 'app/models';
import { ToasterService } from 'angular2-toaster';
import { ErrorCode } from 'app/models/errorcode';

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
  pupils: Pupils;
  constructor(private classClient: ClassClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'pupils', '园儿');
    this.initfileuploader(this.fileUploader2, 'pupils', '园儿');
    this.getpupils();

    this.template = [
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
        class: "大一班",
        name: "李雨轩"
      },
      {
        id: 4,
        year: "2018",
        class: "小一班",
        name: "赵欣怡"
      },
    ];    
  }

  getpupils(showinfomodal: boolean = true) {
    this.loading = true;
    this.classClient.getPupils(this.currentYear, this.currentClass).
      subscribe(
        d => {
          this.loading = false;
          this.pupils = new Pupils(d.pupils);
          if (this.pupils.empty() && showinfomodal) {
            this.infoModal.show();
            this.items = this.template;
          } else {
            this.items = this.pupils.pupils;
            this.items.forEach(n => {
              if (!this.years.includes(n.year)) {
                this.years.push(n.year);
              }
              if (!this.classes.includes(n.class)) {
                this.classes.push(n.class);
              }
            });
          }
        },
        e => this.LogError(e, '获取园儿信息失败，请重试'),
        () => this.LogComplete('pupil component pupils loading completed')
      );
  }

  updatepupil(item: Pupil) {
    this.loading = true;
    this.classClient.updatePupil(item).
      subscribe(
        _ => {
          this.loading = false;
        },
        e => {
          if (e.error.custom_code = ErrorCode.InvalidClass) {
            this.LogError(e, '园儿信息更新失败，请检查班级名');
          } else {
            this.LogError(e, '园儿信息更新失败，请重试');
          }
          this.loading = false;
          // revert
          let idx = this.items.findIndex(i => i.id == item.id);
          this.items[idx] = (<any>item).original;
        },
        () => {
          this.LogComplete('pupil component pupil updating completed');          
        }
      );
  }
}
