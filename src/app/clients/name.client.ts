import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { NameList } from '../models/name';
import { TeacherList } from 'app/models/teacher';
import { environment } from 'environments/environment';

@Injectable()
export class NameClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getNamelist(year?: string, cls?: string): Observable<NameList> {
    let params = new HttpParams();

    if (year && year != "") {
      params = params.set("year", year);
    }
    if (cls && cls != "") {
      params = params.set("class", cls);
    }

    return this.http.get<NameList>(environment.api.baseURI + '/namelist', {headers: this.defaultHeaders, params: params});
  };

  getTeacherlist(year?: string, cls?: string): Observable<TeacherList> {
    let params = new HttpParams();
    
    if (year && year != "") {
      params = params.set("year", year);
    }
    if (cls && cls != "") {
      params = params.set("class", cls);
    }

    return this.http.get<TeacherList>(environment.api.baseURI + '/teacherlist', {headers: this.defaultHeaders, params: params});
  };
}
