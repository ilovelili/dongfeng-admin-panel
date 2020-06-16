import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { ProfileTemplate } from 'app/models';
import { ModalDirective } from 'ngx-bootstrap';
import { environment } from 'environments/environment';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './growth-profile-template.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './growth-profile-template.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GrowthProfileTemplateComponent extends ViewComponent implements OnInit {
  @ViewChild('newProfileTemplateModal', { static: false }) newProfileTemplateModal: ModalDirective
  @ViewChild('deleteConfirmModal', { static: false }) deleteConfirmModal: ModalDirective
  @ViewChild('templatePreviewModal', { static: false }) templatePreviewModal: ModalDirective

  name: string;
  names: string[] = [];
  errormsg: string;

  constructor(
    private profileClient: ProfileClient,
    protected router: Router,
    protected authService: AuthService,
    protected activatedRoute: ActivatedRoute,
    protected toasterService: ToasterService,
    private sanitizer: DomSanitizer,
  ) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getProfileTemplates();
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

  currentTemplateName = ""
  showTemplatePreview(name: string) {
    this.currentTemplateName = name;
    this.newProfileTemplateModal.hide();
    this.deleteConfirmModal.hide();
    this.templatePreviewModal.show();
  }

  show() {
    this.deleteConfirmModal.hide();
    this.templatePreviewModal.hide();
    this.newProfileTemplateModal.show();
  }

  close() {
    this.newProfileTemplateModal.hide();
    this.deleteConfirmModal.hide();
    this.templatePreviewModal.hide();
  }

  currentItem: string;
  showdeleteConfirmModal(name: string) {
    this.currentItem = name;
    this.deleteConfirmModal.show();
  }

  get pdfPreview(): SafeResourceUrl {
    return this.sanitizeUrl(`${environment.api.ebookServer}/templatePreview/${this.currentTemplateName}.pdf`);
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}