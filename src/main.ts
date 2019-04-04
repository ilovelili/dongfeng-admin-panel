import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// check if IE
let ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
if (ua.indexOf("MSIE ") > -1) {
  // legacy IE
  window.alert('您的浏览器不支持该系统，推荐使用谷歌或者火狐浏览器。')
} else if (ua.indexOf("Trident/") > -1) {
  // new IE version. But IE is IE
  window.alert('您的浏览器有可能不支持该系统，推荐使用谷歌或者火狐浏览器。')
}  

platformBrowserDynamic().bootstrapModule(AppModule);
