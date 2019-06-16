import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

declare var window, opr, InstallTrigger, document, safari: any;
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
    window.alert('Opera浏览器有可能不支持该系统。如果您看到空白页面，请使用谷歌或者火狐浏览器。');
  } else if (isSafari) {
    window.alert('Safati浏览器有可能不支持该系统。如果您看到空白页面，请使用谷歌或者火狐浏览器。');    
  } else if (isIE) {
    window.alert('IE浏览器有可能不支持该系统。如果您看到空白页面，请使用谷歌或者火狐浏览器。');
  } else if (isEdge) {
    window.alert('Edge浏览器有可能不支持该系统。如果您看到空白页面，请使用谷歌或者火狐浏览器。');
  } else {
    window.alert('您的浏览器有可能不支持该系统。如果您看到空白页面，请使用谷歌或者火狐浏览器。');
  }
  
  document.cookie = "showalert=true";
}

platformBrowserDynamic().bootstrapModule(AppModule);
