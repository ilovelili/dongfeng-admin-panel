import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { environment } from 'environments/environment';

declare var grapesjs, window, opr, InstallTrigger, document, safari: any;

@Component({
    templateUrl: './growth-profile-template-detail.component.html',
    styleUrls: [
        '../../../scss/vendors/toastr/toastr.scss',
        './growth-profile.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class GrowthProfileTemplateDetailComponent extends ViewComponent implements OnInit {
    private editor: any;
    private profileloaded = false;

    constructor(private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
        super(router, authService, activatedRoute, toasterService);
    }

    ngOnInit(): void {
        this.browsercheck();
        this.loadProfileEditor();
    }

    loadProfileEditor() {
        if (!this.currentName) {
            this.router.navigate(['成长档案']);
        }

        this.editor = grapesjs.init({
            container: '#gjs',
            plugins: [
                'gjs-preset-newsletter',
            ],
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
                urlStore: this.saveEndpoint,
                urlLoad: this.loadEndpoint,
                headers: this.profileClient.rawHeaders,
                contentTypeJson: true,
                credentials: 'omit',
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

        this.profileloaded = true;
    }

    get saveEndpoint(): string {
        return `${environment.api.baseURI}/profileTemplate?name=${this.currentName}`;
    }

    get loadEndpoint(): string {
        return `${environment.api.baseURI}/profileTemplateContent?name=${this.currentName}`;
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

    showExplainModal() {
        this.explainModal.show();
    }
}