import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from 'app/models';

export abstract class BaseClient {  
  private sessionFactory: SessionFactory;

  constructor(protected http: HttpClient) {
    this.sessionFactory = new SessionFactory(new SessionConfig(Constant.SESSION_NAMESPACE, SessionFactory.DRIVERS.LOCAL));
  }

  get defaultHeaders() {
    let headers = {
      'Content-Type': 'application/json',
    };

    if (this.sessionFactory.get(Constant.SESSION_KEY_IDTOKEN)) {
      headers["Authorization"] = 'Bearer ' + this.sessionFactory.get(Constant.SESSION_KEY_IDTOKEN);
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

    if (this.sessionFactory.get(Constant.SESSION_KEY_IDTOKEN)) {
      headers["Authorization"] = 'Bearer ' + this.sessionFactory.get(Constant.SESSION_KEY_IDTOKEN);
    }

    return headers;
  }

  get multipartFormDataHttpOptions() {
    let headers = {};

    if (this.sessionFactory.get(Constant.SESSION_KEY_IDTOKEN)) {
      headers["Authorization"] = 'Bearer ' + this.sessionFactory.get(Constant.SESSION_KEY_IDTOKEN);
    }

    return {
      headers: new HttpHeaders(headers),
    };
  }
}