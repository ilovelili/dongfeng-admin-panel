import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { User, AuthingToken } from '../models/user';
import { Empty } from '../models';
import { environment } from 'environments/environment';

@Injectable()
export class UserClient extends BaseClient {
    constructor(protected http: HttpClient) {
        super(http);
    }

    verifyToken(token: string): Observable<AuthingToken> {
        return this.http.get<AuthingToken>(environment.auth.baseURI + token, { headers: this.defaultHeaders });
    }

    getUser(): Observable<User> {
        return this.http.get<User>(environment.api.baseURI + '/login', { headers: this.defaultHeaders });
    };

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(environment.api.baseURI + '/users', { headers: this.defaultHeaders });
    };

    updateUser(user: User): Observable<Empty> {
        return this.http.put<Empty>(environment.api.baseURI + '/user/update', user, this.defaultHttpOptions);
    };

    uploadAvatar(image: File): Observable<string[]> {
        const formData = new FormData();
        formData.append('image', image);
        return this.http.post<string[]>(environment.api.baseURI + '/user/upload', formData, this.multipartFormDataHttpOptions);
    }
}