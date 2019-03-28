import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { Notifications, Empty } from '../models';
import { environment } from 'environments/environment';

@Injectable()
export class NotificationClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getNotifications(): Observable<Notifications> {
    return this.http.get<Notifications>(environment.api.baseURI + '/dashboard', this.defaultHttpOptions);
  };

  updateNotifications(ids: number[]): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/notifications', { ids: ids }, this.defaultHttpOptions);
  }
}
