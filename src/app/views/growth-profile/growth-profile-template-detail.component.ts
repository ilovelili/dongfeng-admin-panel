import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { environment } from 'environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';

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
    editor: any;
    profileloaded = false;
    tags = "";

    @ViewChild('tagModal', { static: false }) tagModal: ModalDirective

    constructor(private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
        super(router, authService, activatedRoute, toasterService);
        this.loadTags();
    }

    ngOnInit(): void {
        this.browsercheck();

        this.authService.checkLogin().then(
            d => {
                if (!d.status) {
                    this.router.navigate(["页面/登录"])
                } else {
                    this.loadProfileEditor();
                }
            },
            e => {
                this.router.navigate(["页面/登录"])
            }
        );
    }

    loadProfileEditor() {
        if (!this.currentName) {
            this.router.navigate(['成长档案']);
        }

        this.editor = grapesjs.init({
            container: '#gjs',
            height: '1316px',
            plugins: [
                'gjs-preset-newsletter',
            ],
            pluginsOpts: {
                'gjs-preset-newsletter': {},
            },
            canvas: {
                styles: ['https://dong-feng.oss-cn-shanghai.aliyuncs.com/fonts/NotoSerifSC.css'],
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

        this.editor.getModel().set('dmode', 'absolute');

        this.editor.on('load', () => {
            // Style Manager config
            let styleManager = this.editor.StyleManager;
            let fontProperty = styleManager.getProperty('字体和排版', 'font-family');
            let list = fontProperty.get('list');

            // let oswald = [fontProperty.addOption({ value: "'Oswald', sans-serif", name: 'Oswald' })];
            list.push({ value: 'Noto Serif SC', name: '宋体' });
            fontProperty.set('list', list);

            styleManager.addSector('透明度和变形', {
                name: '透明度和变形',
                open: false,
                buildProps: ['opacity', 'transform'],
                properties: [{
                    name: '透明度',
                    type: 'slider',
                    property: 'opacity',
                    defaults: 1,
                    step: 0.1,
                    max: 1,
                    min: 0,
                }, {
                    name: '变形',
                    property: 'transform',
                    properties: [
                        { name: 'x轴旋转', property: 'transform-rotate-x' },
                        { name: 'y轴旋转', property: 'transform-rotate-y' },
                        { name: 'z轴旋转', property: 'transform-rotate-z' },
                        { name: 'x轴比例', property: 'transform-scale-x' },
                        { name: 'y轴比例', property: 'transform-scale-y' },
                        { name: 'z轴比例', property: 'transform-scale-z' },
                    ]
                }]
            });

            styleManager.render();

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
        });
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
        this.tagModal.hide();
        this.explainModal.show();
    }

    showTagModal() {
        this.explainModal.hide();
        this.tagModal.show();
    }

    loadTags() {
        this.profileClient.getProfileTemplateTags(this.currentName.toString()).subscribe(
            (tags) => this.tags = tags,
            (_) => this.toasterService.pop('error', '', '加载标签失败，请重试'),
        )
    }

    updateTags() {
        if (!this.tags.length) return;
        let tags = this.tags.replace("，", ",");

        this.profileClient.updateProfileTemplateTags(this.currentName.toString(), tags).subscribe(
            (_) => {
                this.toasterService.pop('success', '', '编辑标签成功');
                this.tagModal.hide();
            },
            (_) => this.toasterService.pop('error', '', '编辑标签失败，请重试'),
        )
    }
}