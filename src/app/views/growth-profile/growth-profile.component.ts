import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient, ClassClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { environment } from 'environments/environment';
import { Profiles, FormattedProfile, Pupils, Pupil } from 'app/models';

declare var grapesjs, window, opr, InstallTrigger, document, safari: any;

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
  @ViewChild('newprofileModal') newprofileModal
  @ViewChild('confirmModal') confirmModal
  @ViewChild('explainModal') explainModal

  private profileloaded = false;
  private pupils: Pupil[];
  private profiles: FormattedProfile[];

  private pupilyears: string[] = [];
  private pupilclasses: string[] = [];

  private editor: any;

  constructor(private profileClient: ProfileClient, private classClient: ClassClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.browsercheck();
    this.getprofiles();
  }

  getprofiles() {
    this.loading = true;
    this.profileClient.getProfiles(this.currentYear, this.currentClass, this.currentName, this.currentDate).
      subscribe(
        d => {
          if (this.currentYear) {
            this.years.push(this.currentYear);
          }
          if (this.currentClass) {
            this.classes.push(this.currentClass);
          }

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

  getPrev() {
    this.loading = true;
    this.profileClient.getPrevProfile(this.currentYear, this.currentClass, this.currentName, this.currentDate).
      subscribe(
        d => {
          this.loading = false;
          if (d && d.date) {
            this.currentDate = d.date;
            this.loadProfileEditor();
          } else {
            this.LogSuccess('没有上页了');
          }
        },
        e => {
          this.LogError(e, '获取成长档案信息失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('profile component prev profile loading completed')
      );
  }

  getNext() {
    this.loading = true;
    this.profileClient.getNextProfile(this.currentYear, this.currentClass, this.currentName, this.currentDate).
      subscribe(
        d => {
          this.loading = false;
          if (d && d.date) {
            this.currentDate = d.date;
            this.loadProfileEditor();
          } else {
            this.LogSuccess('没有下页了');
          }
        },
        e => {
          this.LogError(e, '获取成长档案信息失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('profile component next profile loading completed')
      );
  }

  showConfirmModal() {
    this.newprofileModal.hide();
    this.profileModal.hide();
    this.explainModal.hide();
    this.confirmModal.show();
  }

  showProfileModal() {
    this.newprofileModal.hide();
    this.confirmModal.hide();
    this.explainModal.hide();
    this.profileModal.show();
  }

  showExplainModal() {
    this.newprofileModal.hide();
    this.confirmModal.hide();
    this.profileModal.hide();
    this.explainModal.show();
  }

  showNewProfileModal() {
    this.confirmModal.hide();
    this.profileModal.hide();
    this.explainModal.hide();
    this.loading = true;

    this.classClient.getPupils().
      subscribe(
        d => {
          this.loading = false;
          let p = new Pupils(d.pupils);
          if (!p.empty()) {
            this.pupils = p.pupils;
            this.pupils.forEach(p => {
              if (!this.pupilyears.includes(p.year)) {
                this.pupilyears.push(p.year);
              }
              if (!this.pupilclasses.includes(p.class)) {
                this.pupilclasses.push(p.class);
              }
            });

            this.newprofileModal.show();
          }
        },
        e => this.LogError(e, '获取成长档案信息失败，请重试'),
        () => this.LogComplete('profile component pupils loading completed')
      );
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

  get profilenames() {
    return this.profiles.filter(p => p.year == this.currentYear && p.class == this.currentClass).map(p => p.name);
  }

  get profiledates() {
    let profile = this.profiles.find(p => p.year == this.currentYear && p.class == this.currentClass && p.name == this.currentName);
    return profile ? profile.dates : [];
  }

  get pupilnames() {
    return this.pupils.filter(p => p.year == this.currentYear && p.class == this.currentClass).map(p => p.name);
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

  createProfile() {
    if (!this.currentYear || !this.currentClass || !this.currentName) {
      this.toasterService.pop('error', '', '请设置正确的条件');
      return;
    }

    // always set date to today when create
    this.currentDate = this.formatDate(new Date());
    this.loading = true;
    let profile = {
      id: 0,
      year: this.currentYear,
      class: this.currentClass,
      name: this.currentName,
      date: this.currentDate,
    };

    this.profileClient.createProfile(profile).subscribe(
      d => {
        this.loading = false;
        this.LogSuccess("成长档案创建成功");
        this.newprofileModal.hide();
        this.loadProfileEditor();
      },
      e => this.LogError(e, '相同成长档案已经存在，无法创建'),
      () => this.LogComplete('profile component profile creation completed')
    );
  }

  deleteProfile() {
    if (!this.currentYear || !this.currentClass || !this.currentName || !this.currentDate) {
      this.toasterService.pop('error', '', '无法删除，请重试');
      return;
    }

    // always set date to today when create    
    this.loading = true;
    let profile = {
      id: 0,
      year: this.currentYear,
      class: this.currentClass,
      name: this.currentName,
      date: this.currentDate,
    };

    this.profileClient.deleteProfile(profile).subscribe(
      d => {
        this.loading = false;
        this.LogSuccess("成长档案删除成功");
        this.profileloaded = false;

        window.location.reload();
      },
      e => this.LogError(e, '成长档案删除失败，请重试'),
      () => this.LogComplete('profile component profile delete completed')
    );
  }

  updateEBookContent(images: string[], html: string, css: string) {
    let profile = {
      id: 0,
      year: this.currentYear,
      class: this.currentClass,
      name: this.currentName,
      date: this.currentDate,
    };

    this.profileClient.updateEBook(profile, images, html, css).subscribe(
      () => { },
      e => console.error(e),
      () => this.LogComplete('profile component update ebook completed')
    );
  }

  loadProfileEditor() {
    if (!this.currentYear || !this.currentClass || !this.currentName || !this.currentDate) {
      this.toasterService.pop('error', '', '请设置正确的检索条件');
      return;
    }

    this.editor = grapesjs.init({
      container: '#gjs',
      plugins: [
        'gjs-preset-newsletter',
        'grapesjs-plugin-export'
      ],
      pluginsOpts: {
        'gjs-preset-newsletter': {},
        'grapesjs-plugin-export': {
          btnLabel: '导出为zip格式',
          filename: editor => `成长档案_${this.currentYear}_${this.currentClass}_${this.currentName}_${this.currentDate}.zip`,
          root: {
            css: {
              'style.css': editor => editor.getCss().replace(/assets\/img/g, '../img') + this.chromePrintCSS(),
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
        onComplete: () => {
          window.setTimeout(() => {
            let body = this.editor.getHtml();
            if (!body) {
              return;
            }
            let images = this.readImgUrls(this.editor),
              html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="./css/style.css"><title="${this.editor.getConfig().title}"></head><body>${body}</body></html>`.replace(/assets\/img/g, './img'),
              css = this.editor.getCss().replace(/assets\/img/g, '../img') + this.chromePrintCSS();
            this.updateEBookContent(images, html, css);
          }, 5000)
        }
      },
      domComponents: { storeWrapper: 1 },
    });

    // Asset Manager config
    const am = this.editor.AssetManager;
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


    // this.updateEBookContent();

    this.profileModal.hide();
    this.profileloaded = true;
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

  // this is for chrome headless print-to-pdf option
  chromePrintCSS(): string {
    return `
@media print {
  @page { margin: 0; }
  body { margin: 1.6cm; }
}`;
  }

  // get image src from HTML file
  imgHTML(): string[] {
    if (!document.querySelector('.gjs-frame')) {
      return [];
    }

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

  readImgUrls(ed: any) {
    let listaImgs = [], content = [];
    let htmlimages = this.imgHTML(),
      cssimages = this.imgCSS(ed);

    listaImgs = htmlimages.concat(cssimages);
    for (let i = 0; i < listaImgs.length; i++) {
      content.push(listaImgs[i].replace(/assets\/img/g, './img'))
    };

    return content
  }

  browsercheck() {
    // Opera 8.0+
    const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
    const isFirefox = typeof InstallTrigger !== 'undefined';
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1 - 71
    const isChrome = !!window.chrome;
    // Blink engine detection
    const isBlink = (isChrome || isOpera) && !!window.CSS;

    // do not alert multiple times by setting a flag in cookie
    if (document.cookie.indexOf("showalert") == -1) {
      if (isChrome || isFirefox || isBlink) {
        // good
      } else if (isOpera) {
        window.alert('Opera浏览器有可能不支持该系统。如果您无法正常编辑成长档案，请使用谷歌或者火狐浏览器。');
      } else if (isSafari) {
        window.alert('Safati浏览器有可能不支持该系统。如果您无法正常编辑成长档案，请使用谷歌或者火狐浏览器。');
      } else if (isIE) {
        window.alert('IE浏览器有可能不支持该系统。如果您无法正常编辑成长档案，请使用谷歌或者火狐浏览器。');
      } else if (isEdge) {
        window.alert('Edge浏览器有可能不支持该系统。如果您无法正常编辑成长档案，请使用谷歌或者火狐浏览器。');
      } else {
        window.alert('您的浏览器有可能不支持该系统。如果您无法正常编辑成长档案，请使用谷歌或者火狐浏览器。');
      }

      document.cookie = "showalert=true";
    }
  }
}