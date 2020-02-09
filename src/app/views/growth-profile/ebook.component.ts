import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { ProfileClient } from 'app/clients';
import { environment } from 'environments/environment';
import { Ebook } from 'app/models/ebook';

@Component({
  templateUrl: './ebook.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './ebook.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EBookComponent extends ViewComponent implements OnInit {
  private oneyear = true; // show only one year

  @ViewChild('ebookModal') ebookModal
  @ViewChild('explainModal') explainModal

  constructor(private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getEbooks();
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      }
    );
  }

  getEbooks() {
    this.loading = true;
    this.profileClient.getEbooks(this.currentYear, this.currentClass, this.currentName).
      subscribe(
        d => {
          if (!d.length) {
            this.LogWarning("没有电子书信息");
          } else {
            this.items = Ebook.sort(d.map((e: Ebook) => {
              return new Ebook(
                e.id,
                e.pupil,
                e.pupil_id,
                e.date
              );
            }));

            this.items.forEach((e: Ebook) => {
              if (!this.classMap.has(e.classId)) {
                this.classMap.set(e.classId, e.className);
              }

              if (!this.pupilMap.has(e.pupilId)) {
                this.pupilMap.set(e.pupilId, e.pupilName);
              }
            });
          }

          this.loading = false;
        },
        e => {
          this.LogError(e, '获取电子书数据失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('ebook component ebook loading completed')
      );
  }

  showebook(ebook: Ebook) {
    this.currentName = ebook.pupilId;
    this.currentClass = ebook.classId;

    this.conditionModal.hide();
    this.explainModal.hide();
    this.ebookModal.show();
  }

  showexplain() {
    this.conditionModal.hide();
    this.ebookModal.hide();
    this.explainModal.show();
  }

  // we can rename file on download as well
  // https://stackoverflow.com/questions/7428831/javascript-rename-file-on-download
  downloadebooks() {
    let url = '';
    let cls = this.classMap.get(this.currentClass);
    let pupil = this.pupilMap.get(this.currentName);
    url = `${environment.api.ebookServer}/${cls}/${pupil}/电子书_${pupil}_${cls}_${this.currentYear}学年.pdf`;
    window.open(url);
  }

  get filteredPupilMap() {
    let pupils = this.items.
      filter(a => a.pupil.class.id == this.currentClass).
      map(a => { return { key: a.pupil.id, value: a.pupil.name } });

    // remove duplicates
    let distincts = {};
    pupils.forEach(p => {
      distincts[p.key] = p.value;
    })

    let results = [];
    for (var key in distincts) {
      results.push({
        key: key,
        value: distincts[key],
      });
    }
    return results;
  }

  get images(): string[] {
    let result = [];
    this.items.filter(i => {
      let filterres = true;
      if (this.currentClass) {
        filterres = filterres && i.classId == this.currentClass;
      }
      if (this.currentName) {
        filterres = filterres && i.pupilId == this.currentName;
      }
      return filterres;
    }).map((i): Ebook => {
      result.push({
        url: `${environment.api.imageServer}/${this.currentYear}/${i.className}/${i.pupilName}/${i.date}.jpg`,
        date: i.date,
      });
      return;
    });

    return result.sort((r1, r2) => {
      let d = new Date(r1.date).getTime() - new Date(r2.date).getTime();
      if (d > 0) return 1;
      if (d < 0) return -1;
      return 0;
    }).map(r => r.url);
  }
}
