import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class BaseClient {
  private namespace: string = 'dongfeng';
  private KEY_TOKEN: string = 'token';
  private KEY_PID: string = 'profile';
  private sessionFactory: SessionFactory;

  constructor(protected http: HttpClient) {
    this.sessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));
  }

  get defaultHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN),
      'X-PID': this.sessionFactory.get(this.KEY_PID)
    });
  }

  get defaultHttpOptions() {
    return {
      headers: this.defaultHeaders,
    };
  }

  // rawHeaders is only used by grapesjs, it removes Angular HttpHeaders wrapper
  get rawHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN),
      'X-PID': this.sessionFactory.get(this.KEY_PID)
    };
  }

  get multipartFormDataHttpOptions() {
    return {
      headers: new HttpHeaders({
        // Setting the Content-Type header manually means it's missing the boundary parameter. Remove that header
        // 'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN),
        'X-PID': this.sessionFactory.get(this.KEY_PID)
      })
    };
  }
}