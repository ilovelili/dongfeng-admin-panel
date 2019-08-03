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