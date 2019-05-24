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
        stepsBeforeSave: 3,
        urlStore: `${environment.api.baseURI}/profile?name='test_n'&class='test_c'&year='test_y'`,
        urlLoad: `${environment.api.baseURI}/profile?name='test_n'&class='test_c'&year='test_y'`,
        headers: this.profileClient.rawHeaders,
        contentTypeJson: true,
        credentials: 'include',

        //Callback before request
        beforeSend(jqXHR, settings) {
          console.log(jqXHR);
          console.log(settings);
        },
        //Callback after request
        onComplete(jqXHR, status) {
          console.log('after');
        },
      }
    });

    // const blockManager = editor.BlockManager;

    // blockManager.get('sect100').set({
    //   label: 'One Section',
    //   attributes: {
    //     title: 'Afure'
    //   }
    // })

    this.loading = false;
  }
}
