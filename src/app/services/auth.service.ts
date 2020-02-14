// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { environment } from 'environments/environment';
import { Auth, Role } from 'app/models';
import { UserClient, ConstClient } from 'app/clients';

(window as any).global = window;
declare var Authing: any;

const KEY_TOKEN: string = 'token';
const KEY_YEAR: string = 'year';
const KEY_CONST: string = 'consts';

@Injectable()
export class AuthService {
  private namespace: string = 'dongfeng';
  private sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));

  constructor(private router: Router, private userClient: UserClient, private constClient: ConstClient) {
  }

  getRole() {
    return this.userClient.getUser();
  }

  setConst() {
    if (!this.sessionFactory.get(KEY_CONST)) {
      this.constClient.getConsts().toPromise().then(
        d => this.sessionFactory.set(KEY_CONST, d)
      );
    }
  }

  validateAccessible() {
    this.getRole().
      subscribe(
        d => {
          if (!this.validateRole(d.role, this.router.url)) {
            this.router.navigate(["班级信息"]);
          }
        },
        e => {
          console.error(e);
          this.logout();
        }
      );
  }

  setSession(auth: Auth) {
    this.sessionFactory.set(KEY_TOKEN, auth.token);    
  }

  clearSession() {
    this.sessionFactory.remove(KEY_TOKEN);    
    this.sessionFactory.remove(KEY_CONST);
    this.sessionFactory.remove(KEY_YEAR);
  }

  get openIdDingTalk(): string {
    const dingTalk = environment.auth.openId.dingTalk;
    return `https://oapi.dingtalk.com/connect/qrconnect?appid=${dingTalk.appId}&response_type=code&scope=snsapi_login&state=${environment.auth.clientId}&redirect_uri=${encodeURIComponent(dingTalk.redirect)}`;
  }

  get openIdWechat(): string {
    const wechat = environment.auth.openId.wechat;
    return `https://open.weixin.qq.com/connect/qrconnect?appid=${wechat.appId}&redirect_uri=${encodeURIComponent(wechat.redirect)}&response_type=code&scope=snsapi_login&state=${environment.auth.clientId}#wechat_redirect`
  }

  logout() {
    this.clearSession();
    this.router.navigate(["/页面/登录"]);
  }

  async checkLogin() {
    let token = this.sessionFactory.get(KEY_TOKEN);
    return await this.userClient.verifyToken(token).toPromise();
  }

  accessibleUrls(role: number): string[] {
    if (role == Role.RoleAgentSmith) return [
      "/班级信息",
      "/幼儿信息",
      "/教师信息",
      "/成长档案",
      "/出勤信息",
      "/体格发育",
      "/膳食管理",
      "/标准数据",
      "/后台管理",
    ];

    if (role == Role.RoleAdmin) return [
      "/班级信息",
      "/幼儿信息",
      "/教师信息",
      "/成长档案",
      "/出勤信息",
      "/体格发育",
      "/膳食管理",
      "/标准数据",
      "/后台管理",
    ];

    if (role == Role.RoleHealth) return [
      "/膳食管理",
      "/体格发育",
      "/标准数据",
    ];

    if (role == Role.RoleNormal) return [
      "/班级信息",
      "/幼儿信息",
      "/教师信息",
      "/成长档案",
      "/出勤信息",
    ];

    if (role == Role.RoleUndefined) return [];
  }

  private validateRole(role: number, url: string): boolean {
    for (let u of this.accessibleUrls(role)) {
      if (decodeURIComponent(url).indexOf(u) > -1) return true;
    }
    return false;
  }
}