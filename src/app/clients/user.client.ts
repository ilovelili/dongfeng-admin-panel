import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { Login, User } from '../models/user';
import { Empty } from '../models';

@Injectable()
export class UserClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getUser(): Observable<Login> {
    return this.http.post<Login>(environment.api.baseURI + '/login', {}, this.defaultHttpOptions);
  };

  updateUser(user: User): Observable<Empty> {
    return this.http.put<Empty>(environment.api.baseURI + '/user/update', {name: user.name, avatar: user.avatar}, this.defaultHttpOptions);
  };

  logout(): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/logout', {}, this.defaultHttpOptions);
  };
}
