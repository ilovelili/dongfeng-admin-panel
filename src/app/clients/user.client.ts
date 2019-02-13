import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { Login } from '../models/user';

@Injectable()
export class UserClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public getUser(): Observable<Login> {
    return this.http.post<Login>(environment.api.baseURI + '/login', {}, this.defaultHttpOptions);
  };
}
