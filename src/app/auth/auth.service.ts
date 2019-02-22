// auth.service.ts
import { Injectable } from '@angular/core';
import * as auth0 from 'auth0-js';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';

(window as any).global = window;

const KEY_TOKEN: string = 'token';
const KEY_EXP: string = 'exp';
const KEY_PROFILE: string = 'profile';
const KEY_AUTHED: string = 'authed';

@Injectable()
export class AuthService {

  private namespace: string = 'dongfeng';
  private sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));

  // Create Auth0 web auth instance
  auth0 = new auth0.WebAuth({
    clientID: environment.auth.clientID,
    domain: environment.auth.domain,
    responseType: 'id_token',
    redirectUri: environment.auth.redirect,
    audience: environment.auth.audience,
    scope: environment.auth.scope
  });

  constructor(private router: Router) {
    this.saveAuthInfo();
  }

  login() {
    // Auth0 authorize request
    this.auth0.authorize({
      language: environment.language,      
    });
  }

  handleLoginCallback() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.idToken) {
        window.location.hash = '';
        this._setSession(authResult);
      } else if (err) {
        console.error(`Error: ${err.error}`);
      }
      window.location.replace(`${environment.host}/growth-profile`);
      // this.router.navigate(['growth-profile']);
    });
  }

  saveAuthInfo() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.idToken) {
        this._setSession(authResult);
      }
    });
  }

  private _setSession(authResult) {
    // Save authentication data and update login status subject    
    this.sessionFactory.set(KEY_TOKEN, authResult.idToken);
    this.sessionFactory.set(KEY_PROFILE, {
      email: authResult.idTokenPayload.email,
      roles: authResult.idTokenPayload.roles,
      name: authResult.idTokenPayload.name,
      nickname: authResult.idTokenPayload.nickname,
      picture: authResult.idTokenPayload.picture,
    });
    this.sessionFactory.set(KEY_EXP, authResult.idTokenPayload.exp * 1000 + Date.now());
    this.sessionFactory.set(KEY_AUTHED, true);
  }

  logout() {
    this.sessionFactory.remove(KEY_TOKEN);
    this.sessionFactory.remove(KEY_PROFILE);
    this.sessionFactory.remove(KEY_EXP);
    this.sessionFactory.remove(KEY_AUTHED);

    // Log out of Auth0 session
    // Ensure that returnTo URL is specified in Auth0
    // Application settings for Allowed Logout URLs
    this.auth0.logout({
      returnTo: environment.host,
      clientID: environment.auth.clientID
    });
  }

  get isLoggedIn(): boolean {
    let exp = this.sessionFactory.get(KEY_EXP);
    if (!exp) {
      return false;
    }

    let authed = this.sessionFactory.get(KEY_EXP);
    if (!authed) {
      return false;
    }

    return Date.now() < exp && authed;
  }
}