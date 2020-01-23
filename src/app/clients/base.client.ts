import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class BaseClient {
  private namespace: string = 'dongfeng';
  private KEY_TOKEN: string = 'token';
  private KEY_PID: string = 'profile';
  private KEY_EMAIL: string = 'email';
  private sessionFactory: SessionFactory;

  constructor(protected http: HttpClient) {
    this.sessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));
  }

  get defaultHeaders() {
    let headers = {
      'Content-Type': 'application/json',      
    };

    if (this.sessionFactory.get(this.KEY_TOKEN)) {
      headers["Authorization"] = 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN);
    }

    if (this.sessionFactory.get(this.KEY_PID)) {
      headers["x-pid"] = this.sessionFactory.get(this.KEY_PID);
    }

    if (this.sessionFactory.get(this.KEY_EMAIL)) {
      headers["x-email"] = this.sessionFactory.get(this.KEY_EMAIL);
    }

    return new HttpHeaders(headers);
  }

  get defaultHttpOptions() {
    return {
      headers: this.defaultHeaders,
    };
  }

  get rawHeaders() {
    let headers = {
      'Content-Type': 'application/json',      
    };

    if (this.sessionFactory.get(this.KEY_TOKEN)) {
      headers["Authorization"] = 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN);
    }

    if (this.sessionFactory.get(this.KEY_PID)) {
      headers["x-pid"] = this.sessionFactory.get(this.KEY_PID);
    }

    if (this.sessionFactory.get(this.KEY_EMAIL)) {
      headers["x-email"] = this.sessionFactory.get(this.KEY_EMAIL);
    }

    return headers;
  }

  get multipartFormDataHttpOptions() {
    let headers = {};

    if (this.sessionFactory.get(this.KEY_TOKEN)) {
      headers["Authorization"] = 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN);
    }

    if (this.sessionFactory.get(this.KEY_PID)) {
      headers["x-pid"] = this.sessionFactory.get(this.KEY_PID);
    }

    if (this.sessionFactory.get(this.KEY_EMAIL)) {
      headers["x-email"] = this.sessionFactory.get(this.KEY_EMAIL);
    }

    return {
      headers: new HttpHeaders(headers),
    };
  }
}