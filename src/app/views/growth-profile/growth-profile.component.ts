import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
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
  constructor(private zone: NgZone, private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => this.loadProfileEditor());    
    this.loading = false;
  }

  loadProfileEditor() {
    const editor = grapesjs.init({
      container: '#gjs',
      plugins: [
        'gjs-preset-newsletter',
        'grapesjs-plugin-export'
      ],
      pluginsOpts: {
        'gjs-preset-newsletter': {},
        'grapesjs-plugin-export': {
          btnLabel: '导出为zip格式',
          filenamePfx: '成长档案',
          root : {
            css: {
              'style.css': editor => editor.getCss().replace(/assets\/img/g,'../img'),
            },
            img:  async editor => {
							const images = await this.readImgs(editor);
							return images;
            },
            'index.html': editor => `<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="./css/style.css"><title="${editor.getConfig().title}"></head><body>${editor.getHtml()}</body></html>`.replace(/assets\/img/g,'./img'), // img path is different from css
          },
        },
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
    for (let i = 1; i <= background_count; i++) {
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
  }

  /***
  image export related
  ***/
  // get image src from CSS file
  imgCSS(ed: any): string[] {
    let code = ed.getCss(),
      imags: string[],
      local = document.location.host.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
      regex = new RegExp('(http:|https:){0,1}\/\/' + local, 'g');

    code = code.replace(regex, '');
    code = code.replace(/(http:|https:){0,1}\/\//g, '#');
    imags = code.match(/\("{0,1}[^#^\(]+?\.(gif|jpg|png|jpeg|tif|tiff|webp|svg|ico)"{0,1}\)/gi);
    if (imags !== null) {
      imags = imags.map(x => x.replace(/\("{0,1}(.*){0,1}"\)/, '$1').replace(/[()]/g,''));
    }
    else
      imags = [];

    return imags;
  }

  // get image src from HTML file
  imgHTML(): string[] {
    let imags: string[] = [],
      src: string,
      code = (<any>document.querySelector('.gjs-frame')).contentDocument.getElementsByTagName('img');

    for (let i = 0; i < code.length; i++) {
      src = code[i].src;
      src = src.replace(location.origin, '');
      if (!src.includes('http')) {
        imags.push(src);
      }
    };

    return imags;
  }

  arrayBufferToBinary(buffer: any) {
    let binary = '',
      bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b: any) => binary += String.fromCharCode(b));
    return binary;
  };

  async readImgs(ed: any) {
    let imgData, listaImgs, petition, archive, content = [];
    let htmlimages = this.imgHTML(),
      cssimages = this.imgCSS(ed);

    listaImgs = htmlimages.concat(cssimages);
    for (let i = 0; i < listaImgs.length; i++) {
      try {
        petition = await fetch(listaImgs[i]);
        imgData = await petition.arrayBuffer();
        archive = petition.url.match(/[^\/\.]*\.[^\.]*$/, '$&')[0];
        content[archive] = this.arrayBufferToBinary(imgData);
      }
      catch (e) {
        console.log("error " + e.message);
      }
    };

    return content
  }
}
