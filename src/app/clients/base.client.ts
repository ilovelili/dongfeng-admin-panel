import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class BaseClient {
  private namespace: string = 'dongfeng';
  private KEY_TOKEN: string = 'token';  
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

    return headers;
  }

  get multipartFormDataHttpOptions() {
    let headers = {};

    if (this.sessionFactory.get(this.KEY_TOKEN)) {
      headers["Authorization"] = 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN);
    }

    return {
      headers: new HttpHeaders(headers),
    };
  }
}