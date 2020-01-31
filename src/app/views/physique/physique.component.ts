import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { PhysiqueClient } from 'app/clients';
import { Physique } from 'app/models';
import { AuthService } from 'app/services/auth.service';

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
  private physiques: Physique[];

  constructor(private physiqueClient: PhysiqueClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'physiques', '体格发育');
    this.initfileuploader(this.fileUploader2, 'physiques', '体格发育');
    this.getphysiques();


    // ID,学员ID,性别,出生日期,体检日期,身高,体重 1,14,男,2013-08-13,2019-12-30,121.2,26.0
    this.template = [
      {
        id: 1,
        pupil_id: 1,
        gender: "男",
        birth_date: "2013-08-13 (注:日期为 年-月-日 或者 年/月/日 格式)",
        exam_date: "2019-04-13",
        height: 115.2,
        weight: 20.1,
      },
      {
        id: 2,
        pupil_id: 2,
        gender: "女",
        birth_date: "2013-06-13",
        exam_date: "2019-04-13",
        height: 105.1,
        weight: 15.1,
      },
      {
        id: 3,
        pupil_id: 3,
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
          this.conditionModal.hide();

          if (!d.length) {
            if (showinfomodal) {
              this.infoModal.show();
              this.items = this.template;
            } else {
              this.LogWarning('没有体格发育信息');
            }
          } else {
            this.physiques = d;
            this.items = d.map(p => new Physique(
              p.id,
              p.pupil,
              p.pupil.id,
              p.gender,
              p.birth_date,
              p.exam_date,
              p.height,
              p.weight,
              p.age,
              p.age_cmp,
              p.height_p,
              p.weight_p,
              p.height_weight_p,
              p.bmi,
              p.fat_cofficient,
              p.conclusion
            ));

            this.items.forEach(p => {
              if (!isNaN(p.classId) && !this.classMap.has(p.classId)) {
                this.classMap.set(p.classId, p.className);
              }
            });
          }
        },
        e => this.LogError(e, '获取体格发育信息失败,请重试'),
        () => this.LogComplete('physique component physiques loading completed')
      );
  }

  updatephysique(item: Physique) {
    this.loading = true;    
    this.physiqueClient.updatePhysique(item).
      subscribe(
        _ => {
          this.LogSuccess('体格发育信息更新');
          // get updated physique
          this.getphysiques();
        },
        e => {
          this.LogError(e, '体格发育信息更新失败,请重试');
          this.loading = false;
        },
        () => this.LogComplete('physique component physique upload completed')
      );
  }

  get names() {
    let result = [];

    this.items.filter(i => {
      let filterres = true;
      if (this.currentYear) {
        filterres = filterres && i.year == this.currentYear;
      }
      if (this.currentClass) {
        filterres = filterres && i.class == this.currentClass;
      }
      return filterres;
    }).map(i => i.name).forEach(n => {
      if (n && !result.includes(n)) {
        result.push(n);
      }
    });

    return result;
  }
}
