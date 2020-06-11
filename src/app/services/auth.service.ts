// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Auth, Role, Constant, User } from 'app/models';
import { UserClient, ConstClient } from 'app/clients';
import { BaseService } from './base.service';
import { DataSharingService } from './data-sharing.service';
import { of, Observable } from 'rxjs';

(window as any).global = window;
declare var Authing: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  constructor(private router: Router, private userClient: UserClient, private constClient: ConstClient, private dataSharingService: DataSharingService) {
    super();
  }

  getUser(): Observable<User> {
    if (this.dataSharingService.user) {
      return of(this.dataSharingService.user);
    }
    return this.userClient.getUser();
  }

  validateAccessible(role: number) {
    if (!this.validateRole(role, this.router.url)) {
      this.router.navigate(["班级信息"]);
    }
  }

  setToken(auth: Auth) {
    this.sessionFactory.set(Constant.SESSION_KEY_IDTOKEN, auth.token);
  }

  clearSession() {
    this.sessionFactory.remove(Constant.SESSION_KEY_CONST);
    this.sessionFactory.remove(Constant.SESSION_KEY_YEAR);
    this.sessionFactory.remove(Constant.SESSION_KEY_IDTOKEN);
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
    let token = this.sessionFactory.get(Constant.SESSION_KEY_IDTOKEN);
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
      "/dummy",
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
      "/dummy",
    ];

    if (role == Role.RoleHealth) return [
      "/班级信息",
      "/幼儿信息",
      "/教师信息",
      "/膳食管理",
      "/体格发育",
      "/标准数据",
      "/dummy",
    ];

    if (role == Role.RoleNormal) return [
      "/班级信息",
      "/幼儿信息",
      "/教师信息",
      "/dummy",
    ];

    if (role == Role.RoleTeacher) return [
      "/班级信息",
      "/幼儿信息",
      "/教师信息",
      "/成长档案",
      "/出勤信息",
      "/dummy",
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