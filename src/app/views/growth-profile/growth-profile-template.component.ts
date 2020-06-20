import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient, PupilClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { ProfileTemplate, Pupil, ProfileCount } from 'app/models';
import { ModalDirective, BsDatepickerConfig, BsLocaleService, defineLocale, zhCnLocale } from 'ngx-bootstrap';
import { environment } from 'environments/environment';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './growth-profile-template.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './growth-profile-template.component.scss',
    '../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GrowthProfileTemplateComponent extends ViewComponent implements OnInit {
  @ViewChild('newProfileTemplateModal', { static: false }) newProfileTemplateModal: ModalDirective
  @ViewChild('deleteConfirmModal', { static: false }) deleteConfirmModal: ModalDirective
  @ViewChild('templatePreviewModal', { static: false }) templatePreviewModal: ModalDirective
  @ViewChild('templateApplyModal', { static: false }) templateApplyModal: ModalDirective
  @ViewChild('profileExistingModal', { static: false }) profileExistingModal: ModalDirective

  name: string;
  names: string[] = [];
  errormsg: string;
  pupils: Pupil[] = [];
  profileCreateDate = new Date();
  datepickerConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  exsitingProfiles: ProfileCount[] = [];
  currentTemplateName = "";
  currentTemplateId = 0;

  constructor(
    private profileClient: ProfileClient,
    protected router: Router,
    protected authService: AuthService,
    protected activatedRoute: ActivatedRoute,
    protected toasterService: ToasterService,
    private sanitizer: DomSanitizer,
    private pupilClient: PupilClient,
    protected localeService: BsLocaleService,
  ) {
    super(router, authService, activatedRoute, toasterService);

    if (this.localeService) {
      defineLocale(zhCnLocale.abbr, zhCnLocale);
      // https://github.com/valor-software/ngx-bootstrap/issues/4054    
      this.localeService.use(zhCnLocale.abbr);
      this.datepickerConfig = {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'YYYY-MM-DD',
      };
    }
  }

  ngOnInit(): void {
    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getProfileTemplates();
          this.getPupils();
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      }
    );
  }

  getProfileTemplates() {
    this.loading = true;
    this.profileClient.getProfileTemplates().
      subscribe(
        d => {
          if (d.length) {
            this.items = d.map(p => new ProfileTemplate(
              p.id,
              p.name,
              p.created_by,
              p.tags)
            );
            this.names = this.items.map(i => i.name);
          } else {
            this.items = [];
            this.LogWarning("没有成长档案模板");
          }
          this.loading = false;
        },
        e => {
          this.LogError(e, '获取成长档案模板失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('profile template component profile loading completed')
      );
  }

  createProfileTemplate() {
    if (this.names.indexOf(this.name) > -1) {
      this.errormsg = '已存在相同模板名';
      return;
    }

    this.loading = true;
    this.profileClient.createProfileTemplate(this.name).
      subscribe(
        d => {
          this.router.navigate(['/成长档案/模板', this.name]);
        },
        e => {
          this.LogError(e, '保存成长档案模板失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('profile template component profile saving completed')
      );
  }

  deleteProfileTemplate(name: string) {
    this.loading = true;
    this.profileClient.deleteProfileTemplate(name).
      subscribe(
        _ => {
          this.getProfileTemplates();
        },
        e => {
          this.LogError(e, '删除成长档案模板失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('profile template component profile delete completed')
      );
    this.close();
  }

  getPupils() {
    this.loading = true;
    this.pupilClient.getPupils(this.currentYear).
      subscribe(
        d => {
          this.loading = false;
          this.pupils = d.map(p => {
            let _pupil = new Pupil();
            _pupil.id = p.id;
            _pupil.class = p.class;
            _pupil.name = p.name;
            return _pupil;
          });

          if (this.pupils.length) {
            this.pupils.forEach((p: Pupil) => {
              if (!this.classMap.has(p.class.id)) {
                this.classMap.set(p.class.id, p.class.name);
              }
            });
          }
        },
        e => this.LogError(e, '获取幼儿信息失败，请重试'),
      );
  }

  clicked = false;
  exclusivePupilIds = [];

  preApplyProfileTemplate() {
    if (!this.currentClass) {
      this.toasterService.pop('error', '', '请指定班级');
      return;
    }

    this.clicked = true;
    this.profileClient.getProfileCount(this.currentClass, this.dateToString(this.profileCreateDate)).subscribe(
      (profileCounts: any[]) => {
        if (profileCounts.length) {
          this.exsitingProfiles = profileCounts.map(p => new ProfileCount(p.pupilId, p.pupil, p.class));
          this.exclusivePupilIds = this.exsitingProfiles.map(p => p.pupilId);
          this.showProfileExisting();
          this.clicked = false;
        } else {
          this.applyProfileTemplate();
          this.clicked = false;
        }
      },
      (e) => {
        console.error(e);
      }
    );
  }

  overwriteClicked = false;
  nonOverwirteClicked = false;
  applyProfileTemplate(overwrite = false) {
    overwrite ? this.overwriteClicked = true : this.nonOverwirteClicked = true;

    this.profileClient.applyProfileTemplate(
      this.dateToString(this.profileCreateDate),
      this.currentClass,
      this.exclusivePupilIds,
      this.currentTemplateId,
      overwrite
    ).subscribe(
      (_) => {
        this.toasterService.pop('success', '', '模板应用成功');
      },
      (err) => {
        this.toasterService.pop('error', '', '模板应用失败，请重试');
        console.error(err);
      },
      () => {
        this.overwriteClicked = false;
        this.nonOverwirteClicked = false;
        this.close();
      }
    );
  }

  showTemplatePreview(template: ProfileTemplate) {
    this.currentTemplateName = template.name;
    this.currentTemplateId = template.id;

    this.newProfileTemplateModal.hide();
    this.deleteConfirmModal.hide();
    this.templateApplyModal.hide();
    this.profileExistingModal.hide();
    this.templatePreviewModal.show();
  }

  showTemplateApply(template: ProfileTemplate) {
    this.currentTemplateName = template.name;
    this.currentTemplateId = template.id;

    this.newProfileTemplateModal.hide();
    this.deleteConfirmModal.hide();
    this.templatePreviewModal.hide();
    this.profileExistingModal.hide();
    this.templateApplyModal.show();
  }

  showProfileExisting() {
    this.newProfileTemplateModal.hide();
    this.deleteConfirmModal.hide();
    this.templatePreviewModal.hide();
    this.templateApplyModal.hide();
    this.profileExistingModal.show();
  }

  show() {
    this.deleteConfirmModal.hide();
    this.templatePreviewModal.hide();
    this.templateApplyModal.hide();
    this.profileExistingModal.hide();
    this.newProfileTemplateModal.show();
  }

  close() {
    this.newProfileTemplateModal.hide();
    this.deleteConfirmModal.hide();
    this.templatePreviewModal.hide();
    this.templateApplyModal.hide();
    this.profileExistingModal.hide();
  }

  currentItem: string;
  showdeleteConfirmModal(name: string) {
    this.currentItem = name;
    this.deleteConfirmModal.show();
  }

  get pdfPreview(): SafeResourceUrl {
    return this.sanitizeUrl(`${environment.api.templatePrevServer}/${this.currentTemplateName}.pdf`);
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}