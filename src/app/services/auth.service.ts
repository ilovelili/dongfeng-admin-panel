// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { environment } from 'environments/environment';
import { Auth, Role } from 'app/models';
import { UserClient } from 'app/clients';

(window as any).global = window;
declare var Authing: any;

const KEY_TOKEN: string = 'token';
const AUTHING_TOKEN: string = '_authing_token';
const KEY_EXP: string = 'exp';
const KEY_AUTHED: string = 'authed';

@Injectable()
export class AuthService {
  private namespace: string = 'dongfeng';
  private sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));

  constructor(private router: Router, private userClient: UserClient) {
  }

  getRole() {
    return this.userClient.getUser();
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
    this.sessionFactory.set(KEY_EXP, new Date(auth.tokenExpiredAt).getTime());
    this.sessionFactory.set(KEY_AUTHED, true);
  }

  clearSession() {
    this.sessionFactory.remove(AUTHING_TOKEN);
    this.sessionFactory.remove(KEY_TOKEN);    
    this.sessionFactory.remove(KEY_EXP);
    this.sessionFactory.remove(KEY_AUTHED);
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

  get isLoggedIn(): boolean {
    let exp = this.sessionFactory.get(KEY_EXP);
    if (!exp) {
      return false;
    }

    let authed = this.sessionFactory.get(KEY_AUTHED);
    if (!authed) {
      return false;
    }

    return Date.now() < exp && authed;
  }

  accessibleUrls(role: number): string[] {
    if (role == Role.RoleAgentSmith) return [
      "/班级信息",
      "/园儿信息",
      "/教师信息",
      "/成长档案",
      "/出勤信息",
      "/体格发育",
      "/膳食管理",
      "/标准数据",
      // 设置面板 TBD (update user, teacher info ...)
    ];

    if (role == Role.RoleAdmin) return [
      "/班级信息",
      "/园儿信息",
      "/教师信息",
      "/成长档案",
      "/出勤信息",
      "/体格发育",
      "/膳食管理",
      "/标准数据",
    ];

    if (role == Role.RoleHealth) return [
      "/膳食管理",
      "/体格发育",
      "/标准数据",
    ];

    if (role == Role.RoleNormal) return [
      "/班级信息",
      "/园儿信息",
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