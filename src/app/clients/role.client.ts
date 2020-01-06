import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Role } from 'app/models';

@Injectable()
export class RoleClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getRole(): Observable<Role> {
    return this.http.get<Role>(environment.api.baseURI + '/role', { headers: this.defaultHeaders });
  };
}
