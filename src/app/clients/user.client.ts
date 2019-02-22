import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { Login, User, ImageUpload } from '../models/user';
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

  uploadAvatar(image: File): Observable<ImageUpload> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<ImageUpload>(environment.api.baseURI + '/user/upload', formData, this.multipartFormDataHttpOptions);
  }

  logout(): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/logout', {}, this.defaultHttpOptions);
  };
}
