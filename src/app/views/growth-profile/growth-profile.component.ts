import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { environment } from 'environments/environment';

declare var grapesjs: any;

@Component({
  templateUrl: './growth-profile.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './growth-profile.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GrowthProfileComponent extends ViewComponent implements OnInit {
  constructor(private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    const editor = grapesjs.init({
      container: '#gjs',
      plugins: ['gjs-preset-newsletter'],
      pluginsOpts: {
        'gjs-preset-newsletter': {},
      },
      // https://github.com/artf/grapesjs/blob/dev/src/storage_manager/config/config.js
      storageManager: {
        id: 'gjs-',
        type: 'remote',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
        urlStore: `${environment.api.baseURI}/profile?name='test_n'&class='test_c'&year='test_y'`,
        urlLoad: `${environment.api.baseURI}/profile?name='test_n'&class='test_c'&year='test_y'`,
        headers: this.profileClient.rawHeaders,
        contentTypeJson: true,
        credentials: 'include',
      },
      domComponents: { storeWrapper: 1 },
    });

    // Asset Manager config
    const am = editor.AssetManager;
    const imageDir = 'assets/img/';
    const background_count = 3;
    const stamp_count = 5;

    let assets = [];
    for(let i = 1; i <= background_count; i++) {
      assets.push({
        category: 'background',
        src: `${imageDir}background_${i}.png`,
      });
    }

    for (let i = 1; i <= stamp_count; i++) {
      assets.push({
        category: 'stamp',
        src: `${imageDir}stamp_${i}.png`,
      });
    }

    am.add(assets);
    am.render();

    this.loading = false;
  }
}
