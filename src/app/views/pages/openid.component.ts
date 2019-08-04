import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'app/models';

export abstract class OpenIdComponent {
  protected openId: string;
  protected openIdCallback() {
    const code = parseInt(this.getQueryString('code'));
    if (code !== 200) {
      // return error message
      console.error(this.getQueryString('message'));
      window.alert('登录失败,请重试');
      this.router.navigate(["/页面/登录"]);
    }

    const userInfo: Auth = JSON.parse(this.getQueryString('data'));
    if (!userInfo.email) {
      window.alert(`您的${this.openId}帐号没有绑定邮箱,系统将生成临时邮箱以完成登录，请稍候在用户信息中修改邮箱地址`);
      // userInfo.email = `${userInfo.unionid}@dongfeng.cn`; // do it on backend
    }

    this.authService.setSession(userInfo);
    this.router.navigate(["班级信息"]);
  }

  constructor(protected router: Router, protected authService: AuthService) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["班级信息"]);
    }
  }

  getQueryString(name: string): string {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return "";
  }
}

@Component({
  templateUrl: 'openid.component.html',
})
export class OpenIdDingTalkComponent extends OpenIdComponent {
  constructor(protected router: Router, protected authService: AuthService) {
    super(router, authService);
    this.openIdCallback();
  }

  openId: string = "钉钉";
}
