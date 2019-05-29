import { Component, OnInit, ViewEncapsulation, NgZone, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { environment } from 'environments/environment';
import { Profiles, FormattedProfile } from 'app/models';

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
  @ViewChild('profileModal') profileModal
  private profiles: FormattedProfile[];

  private namequery: string = '';
  private nameurl: string = '';
  private nameparams: Object = {};

  private datequery: string = '';
  private dateurl: string = '';
  private dateparams: Object = {};

  constructor(private zone: NgZone, private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.nameurl = `${environment.api.baseURI}/profile/names`;
    this.dateurl = `${environment.api.baseURI}/profile/dates`;
  }

  ngOnInit(): void {
    this.updateparams();
    this.getprofiles();
  }

  getprofiles() {
    this.loading = true;
    this.profileClient.getProfiles(this.currentYear, this.currentClass, this.currentName, this.currentDate).
      subscribe(
        d => {
          this.loading = false;
          this.profiles = new Profiles(d.profiles).format();
          this.profiles.forEach(p => {
            if (!this.years.includes(p.year)) {
              this.years.push(p.year);
            }
            if (!this.classes.includes(p.class)) {
              this.classes.push(p.class);
            }
          });

          this.showProfileModal();
        },
        e => {
          this.LogError(e, '获取成长档案信息失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('profile component profile loading completed')
      );
  }

  showProfileModal() {
    this.profileModal.show();
  }
  
  getdates(year?: string, cls?: string, name?: string) {
    return this.profiles.find(p => {
      let result = true;
      if (year) {
        result = result && p.year == year;
      }
      if (cls) {
        result = result && p.class == cls;
      }
      if (name) {
        result = result && p.name == name;
      }
      return result;
    }).dates;
  }

  setprofileyear(year: string) {    
    this.setyear(year);
    this.updateparams();
  }

  setprofileclass(cls: string) {    
    this.setclass(cls);
    this.updateparams();
  }

  setprofilename(name: string) {
    this.namequery = name;
    this.setname(name);
    this.updateparams();
  }

  setprofiledate(date: string) {
    this.datequery = date;
    this.setdate(date);
    this.updateparams();
  }

  updateparams() {
    this.nameparams = {
      year: this.currentYear || '',
      class: this.currentClass || '',
      date: this.currentDate || '',
    };

    this.dateparams = {
      year: this.currentYear || '',
      class: this.currentClass || '',
      name: this.currentName || '',
    };
  }

  get endpoint(): string {
    let url = `${environment.api.baseURI}/profile?`;
    let query = [];

    if (this.currentYear) {
      query.push(`year=${this.currentYear}`);
    }
    if (this.currentClass) {
      query.push(`class=${this.currentClass}`);
    }
    if (this.currentName) {
      query.push(`name=${this.currentName}`);
    }
    if (this.currentDate) {
      query.push(`date=${this.currentDate}`);
    }

    return url + query.join('&');
  }

  loadProfileEditor() {
    if (!this.currentYear || !this.currentClass || !this.currentName || !this.currentDate) {
      this.LogError('empty search params', '请设置正确的检索条件');
      return;
    }

    this.zone.runOutsideAngular(() => {
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
            root: {
              css: {
                'style.css': editor => editor.getCss().replace(/assets\/img/g, '../img'),
              },
              img: async editor => {
                const images = await this.readImgs(editor);
                return images;
              },
              'index.html': editor => `<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="./css/style.css"><title="${editor.getConfig().title}"></head><body>${editor.getHtml()}</body></html>`.replace(/assets\/img/g, './img'), // img path is different from css
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
          urlStore: this.endpoint,
          urlLoad: this.endpoint,
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
    });

    this.profileModal.hide();
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
      imags = imags.map(x => x.replace(/\("{0,1}(.*){0,1}"\)/, '$1').replace(/[()]/g, ''));
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