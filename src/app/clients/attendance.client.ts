import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Attendances } from 'app/models/attendance';

@Injectable()
export class AttendanceClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getAttendances(year?:string, cls?: string, name?: string, from?: string, to?: string): Observable<Attendances> {
    let params = new HttpParams();
    
    if (year && year != "") {
      params = params.set("year", year);
    }
    if (cls && cls != "") {
      params = params.set("class", cls);
    }
    if (name && name != "") {
      params = params.set("name", name);
    }
    if (from && from != "") {
      params = params.set("from", from);
    }
    if (to && to != "") {
      params = params.set("to", to);
    }

    return this.http.get<Attendances>(environment.api.baseURI + '/attendances', {headers: this.defaultHeaders, params: params});
  };  
}
