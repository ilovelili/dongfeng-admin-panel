// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { environment } from 'environments/environment';
import { Auth } from 'app/models';

(window as any).global = window;
declare var Authing: any;

const KEY_TOKEN: string = 'token';
const KEY_EXP: string = 'exp';
const KEY_PID: string = 'profile';
const KEY_AUTHED: string = 'authed';


@Injectable()
export class AuthService {
  private namespace: string = 'dongfeng';
  private sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));

  constructor(private router: Router) {
  }

  setSession(auth: Auth) {
    this.sessionFactory.set(KEY_TOKEN, auth.token);
    this.sessionFactory.set(KEY_PID, auth._id);
    this.sessionFactory.set(KEY_EXP, new Date(auth.tokenExpiredAt).getTime());
    this.sessionFactory.set(KEY_AUTHED, true);
  }

  clearSession() {
    this.sessionFactory.remove(KEY_TOKEN);
    this.sessionFactory.remove(KEY_PID);
    this.sessionFactory.remove(KEY_EXP);
    this.sessionFactory.remove(KEY_AUTHED);
  }

  get openIdDingTalk(): string {
    const dingTalk = environment.auth.openId.dingTalk;
    return `https://oapi.dingtalk.com/connect/qrconnect?appid=${dingTalk.appId}&response_type=code&scope=snsapi_login&state=${environment.auth.clientId}&redirect_uri=${dingTalk.redirect}`;
  }

  // authing logout returns unknown error ...
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
}