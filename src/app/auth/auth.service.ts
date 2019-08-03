// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { environment } from 'environments/environment';
import { Auth } from 'app/models';

declare var Authing: any
(window as any).global = window;

const KEY_TOKEN: string = 'token';
const KEY_EXP: string = 'exp';
const KEY_PROFILE: string = 'profile';
const KEY_AUTHED: string = 'authed';


@Injectable()
export class AuthService {
  private namespace: string = 'dongfeng';
  private sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));
  private authing: any;

  constructor(private router: Router) {
  }

  setSession(auth: Auth) {
    this.sessionFactory.set(KEY_TOKEN, auth.token);
    this.sessionFactory.set(KEY_PROFILE, {
      id: auth._id,
      email: auth.email,
      name: auth.username,
      nickname: auth.nickname,
      picture: auth.photo,
    });
    this.sessionFactory.set(KEY_EXP, new Date(auth.tokenExpiredAt).getTime());
    this.sessionFactory.set(KEY_AUTHED, true);
  }

  clearSession() {
    this.sessionFactory.remove(KEY_TOKEN);
    this.sessionFactory.remove(KEY_PROFILE);
    this.sessionFactory.remove(KEY_EXP);
    this.sessionFactory.remove(KEY_AUTHED);
  }

  get openIdDingTalk(): string {
    const dingTalk = environment.auth.openId.dingTalk;
    return `https://oapi.dingtalk.com/connect/qrconnect?appid=${dingTalk.appId}&response_type=code&scope=snsapi_login&state=${environment.auth.clientId}&redirect_uri=${dingTalk.redirect}`;
  }

  // data=%7B"_id":"5d459af97e1e22968005900d","email":null,"emailVerified":false,"unionid":"dingtalk%7CSMiPsiSvAuPIPZbsiSlKZMpfAiEiE","openid":null,"oauth":"%7B%5C"nick%5C":%5C"居敏%5C",%5C"unionid%5C":%5C"SMiPsiSvAuPIPZbsiSlKZMpfAiEiE%5C",%5C"dingId%5C":%5C"$:LWCP_v1:$0rSBHOxkmbzs651GYwACpNZVEiPFikVH%5C",%5C"openid%5C":%5C"LdNUYiS1iPVTTk2biPeUoiiWggiEiE%5C",%5C"main_org_auth_high_level%5C":false%7D","registerMethod":"social:dingtalk","username":"居敏","nickname":"居敏","company":"","photo":"https:%2F%2Fusercontents.authing.cn%2Fauthing-avatar.png","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjpudWxsLCJ1bmlvbmlkIjoiZGluZ3RhbGt8U01pUHNpU3ZBdVBJUFpic2lTbEtaTXBmQWlFaUUiLCJpZCI6IjVkNDU5YWY5N2UxZTIyOTY4MDA1OTAwZCIsImNsaWVudElkIjoiNWQzZDQ4NDc2NjkyZWEyYzdjZjY4ZmY3In0sImlhdCI6MTU2NDg0Mzc1NSwiZXhwIjoxNTY1MTAyOTU1fQ.3yDTrlH3mSKXUf17ZJ9G_uFpocAeaqgfDz2C12v2CuI","tokenExpiredAt":"Tue%20Aug%2006%202019%2022:49:15%20GMT%2B0800%20(CST)","loginsCount":6,"lastLogin":"Sat%20Aug%2003%202019%2022:49:15%20GMT%2B0800%20(CST)","lastIP":"153.204.6.156","signedUp":"Sat%20Aug%2003%202019%2022:32:25%20GMT%2B0800%20(CST)","blocked":false,"isDeleted":false%7D&code=200
  getQueryString(name: string): string {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return "";
  }

  logout() {
    this.authing.logout(this.sessionFactory.get(KEY_PROFILE).id);
    this.clearSession();
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