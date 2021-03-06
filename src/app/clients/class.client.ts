import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Class } from 'app/models/class';

@Injectable()
export class ClassClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getClasses(year?: string): Observable<Class[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set("year", year);
    }
    return this.http.get<Class[]>(environment.api.baseURI + '/classes', { headers: this.defaultHeaders, params: params });
  };
}
