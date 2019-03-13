import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { NameList } from '../models/name';

@Injectable()
export class NameClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getNamelist(cls?: string, year?: string): Observable<NameList> {
    let params = new HttpParams();
    if (cls && cls != "") {
      params.append("class", cls);
    }
    if (year && year != "") {
      params.append("year", year);
    }

    return this.http.get<NameList>(environment.api.baseURI + '/namelist', {headers: this.defaultHeaders, params: params});
  };
}
