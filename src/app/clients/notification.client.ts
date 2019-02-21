import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { Notifications } from '../models';

@Injectable()
export class NotificationClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public getNotifications(): Observable<Notifications> {
    return this.http.get<Notifications>(environment.api.baseURI + '/dashboard', this.defaultHttpOptions);
  };
}
