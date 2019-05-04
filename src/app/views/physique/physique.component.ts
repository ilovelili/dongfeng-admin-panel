import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { PhysiqueClient } from 'app/clients/physique.client';
import { Physiques, Physique } from 'app/models/physique';
import { ErrorCode } from 'app/models/errorcode';

@Component({
  templateUrl: './physique.component.html',
  styleUrls: [
    '../../../scss/vendors/file-uploader/file-uploader.scss',
    '../../../scss/vendors/toastr/toastr.scss',
    './physique.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PhysiqueComponent extends ViewComponent implements OnInit {
  private physiques: Physiques;

  constructor(private physiqueClient: PhysiqueClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'physiques', '体格检查', null, this.errcallback);
    this.initfileuploader(this.fileUploader2, 'physiques', '体格检查', null, this.errcallback);
    this.getphysiques();

    this.template = [
      {
        id: 1,
        year: "2019",
        class: "小一班",
        name: "王子涵",
        gender: "男",
        birth_date: "2013-08-13 (注:日期为 年-月-日 或者 年/月/日 格式)",
        exam_date: "2019-04-13",
        height: 115.2,
        weight: 20.1,
      },
      {
        id: 2,
        year: "2019",
        class: "小一班",
        name: "赵欣怡",
        gender: "女",
        birth_date: "2013-06-13",
        exam_date: "2019-04-13",
        height: 105.1,
        weight: 15.1,
      },
      {
        id: 3,
        year: "2019",
        class: "大一班",
        name: "李雨轩",
        gender: "女",
        birth_date: "2011-06-13",
        exam_date: "2019-04-13",
        height: 115.1,
        weight: 20.5,
      },
    ];
  }

  getphysiques(showinfomodal: boolean = true) {
    this.loading = true;
    this.physiqueClient.getPhysiques(this.currentYear, this.currentClass, this.currentName).
      subscribe(
        d => {
          this.loading = false;
          this.physiques = new Physiques(d.physiques);
          if (this.physiques.empty()) {
            if (showinfomodal) {
              this.infoModal.show();
              this.items = this.template;
            }
          } else {
            this.items = d.physiques;
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
        e => this.LogError(e, '获取体格检查信息失败,请重试'),
        () => this.LogComplete('physique component physiques loading completed')
      );
  }

  updatephysique(item: Physique) {
    this.loading = true;

    // keep original fields like class, name, year
    let i = (<any>item).original;
    i.gender = item.gender;
    i.birth_date = item.birth_date;
    i.exam_date = item.exam_date
    i.height = item.height + ''; // to string
    i.weight = item.weight + '';

    this.physiqueClient.updatePhysique(i).
      subscribe(
        _ => {
          // get updated physique
          this.getphysiques();
        },
        e => {
          if (e.error.custom_code == ErrorCode.InvalidPupil) {
            this.LogError(e, '体格检查信息更新失败,请检查班级名和园儿姓名');
          } else {
            this.LogError(e, '体格检查信息更新失败,请重试');
          }
          this.loading = false;
          // revert
          let idx = this.items.findIndex(i => i.id == item.id);
          this.items[idx] = (<any>item).original;
        },
        () => this.LogComplete('physique component physique upload completed')
      );
  }

  // this must be passed from parent
  errcallback(res: string, me: any) {
    let resjson = JSON.parse(res);
    if (resjson.custom_code == ErrorCode.InvalidPupil) {
      me.LogError(res, '体格检查信息更新失败,请检查班级名和园儿姓名');
    } else {
      me.LogError(res, '体格检查信息更新失败,请重试');
    }
  }
}
