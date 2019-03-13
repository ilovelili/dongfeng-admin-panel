import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class BaseClient {
  private namespace: string = 'dongfeng';
  private KEY_TOKEN: string = 'token';
  private sessionFactory: SessionFactory;

  constructor(protected http: HttpClient) {
    this.sessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));
  }

  get defaultHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN),
      })
    };
  }

  get multipartFormDataHttpOptions() {
    return {
      headers: new HttpHeaders({
        // Setting the Content-Type header manually means it's missing the boundary parameter. Remove that header
        // 'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.sessionFactory.get(this.KEY_TOKEN),
      })
    };
  }
}