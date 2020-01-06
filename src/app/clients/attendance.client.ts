import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { AttendanceResponse, Empty, FormattedAttendance } from 'app/models/';

@Injectable()
export class AttendanceClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getAttendances(year?: string, cls?: string, name?: string, from?: string, to?: string): Observable<AttendanceResponse> {
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

    return this.http.get<AttendanceResponse>(environment.api.baseURI + '/attendances', {
      headers: this.defaultHeaders,
      params: params,
      withCredentials: false,
    });
  };

  updateAttendance(attendance: FormattedAttendance): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/attendance', {
      year: attendance.year,
      class: attendance.class,
      date: attendance.date,
      name: attendance.name,
      attendance: attendance.attendance == 'o',
    }, this.defaultHttpOptions);
  };
}
