import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { ProfileClient } from 'app/clients';
import { environment } from 'environments/environment';
import { Ebook } from 'app/models/ebook';
import { ModalDirective } from 'ngx-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  templateUrl: './ebook.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './ebook.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EBookComponent extends ViewComponent implements OnInit {
  oneYear = true; // show only one year

  @ViewChild('ebookModal', { static: false }) ebookModal: ModalDirective
  @ViewChild('explainModal', { static: false }) explainModal: ModalDirective

  constructor(
    private profileClient: ProfileClient,
    protected router: Router,
    protected authService: AuthService,
    protected activatedRoute: ActivatedRoute,
    protected toasterService: ToasterService,
    public sanitizer: DomSanitizer,
  ) {
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
          this.conditionModal.hide();
        },
        e => {
          this.LogError(e, '获取电子书数据失败，请重试');
          this.loading = false;
          this.conditionModal.hide();
        },
        () => this.LogComplete('ebook component ebook loading completed')
      );
  }

  showEbook(ebook: Ebook, oneYear: boolean) {
    this.oneYear = oneYear;

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

  get downloadUrl() {
    let cls = this.classMap.get(this.currentClass);
    let pupil = this.pupilMap.get(this.currentName);
    return this.oneYear ?
      `${environment.api.ebookServer}/${cls}/${pupil}/电子书_${pupil}_${cls}_${this.currentYear}学年.pdf` :
      `${environment.api.ebookServer}/${cls}/${pupil}/电子书_${pupil}_${cls}_全期间.pdf`;
  }

  get prevUrl() {
    let cls = this.classMap.get(this.currentClass);
    let pupil = this.pupilMap.get(this.currentName);
    return this.oneYear ?
      `${environment.api.ebookPrevServer}/${cls}/${pupil}/电子书_${pupil}_${cls}_${this.currentYear}学年.pdf` :
      `${environment.api.ebookPrevServer}/${cls}/${pupil}/电子书_${pupil}_${cls}_全期间.pdf`
  }

  // we can rename file on download as well
  // https://stackoverflow.com/questions/7428831/javascript-rename-file-on-download
  downloadebooks() {
    window.open(this.downloadUrl);
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

  get pdfPreview(): SafeResourceUrl {
    return this.sanitizeUrl(this.prevUrl);
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
