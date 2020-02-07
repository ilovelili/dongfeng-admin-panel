import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { ProfileTemplate } from 'app/models';

@Component({
  templateUrl: './growth-profile-template.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './growth-profile-template.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GrowthProfileTemplateComponent extends ViewComponent implements OnInit {
  @ViewChild('newProfileTemplateModal') newProfileTemplateModal

  private name: string;
  private names: string[] = [];
  private errormsg: string;

  constructor(private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.getProfileTemplates();
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
              p.created_by)
            );
            this.names = this.items.map(i => i.name);
          } else {
            this.items = [];
            this.LogWarning("没有电子书模板");
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

  deleteProfileTemplate(e: Event, name: string) {
    e.preventDefault();
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
  }

  show(e: Event) {
    this.newProfileTemplateModal.show();
  }

  close(e: Event) {
    this.newProfileTemplateModal.hide();
  }
}