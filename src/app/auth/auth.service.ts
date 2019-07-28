// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { environment } from 'environments/environment';
import { Auth } from 'app/models';
import { Guard } from '@authing/guard';

(window as any).global = window;

const KEY_TOKEN: string = 'token';
const KEY_EXP: string = 'exp';
const KEY_PROFILE: string = 'profile';
const KEY_AUTHED: string = 'authed';
const CLIENT_ID: string = '5d3d48476692ea2c7cf68ff7';

@Injectable()
export class AuthService {
  private namespace: string = 'dongfeng';
  private sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));
  private authing: any;

  constructor(private router: Router) {}

  login() {
    this._clearSession();
    let me = this;
    const form = new Guard(CLIENT_ID, {
      timestamp: Math.round((new Date()).getTime() / 1000),
      nonce: Math.ceil(Math.random() * Math.pow(10, 6)),
    });

    form.on('error', function(err) {
      console.log(err);
    })

    // form.on('login', function (auth: Auth) {      
    //   if (auth && auth.token) {
    //     window.location.hash = '';
    //     me._setSession(auth);
    //   }
    //   window.location.replace(`${environment.host}/班级信息`);
    // });

    // form.on('authing-load', async function(authing) {
    //   const result = await authing.checkLoginStatus();
    //   if (result.status) {
    //       form.hide();
    //   }
    //   me.authing = authing;
    // })
  }
  
  private _setSession(auth: Auth) {
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

  private _clearSession() {
    this.sessionFactory.remove(KEY_TOKEN);
    this.sessionFactory.remove(KEY_PROFILE);
    this.sessionFactory.remove(KEY_EXP);
    this.sessionFactory.remove(KEY_AUTHED);
  }

  logout() {    
    this.authing.logout(this.sessionFactory.get(KEY_PROFILE).id);
    this._clearSession();
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