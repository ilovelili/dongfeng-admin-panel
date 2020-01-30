import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Empty, FormattedAttendance, Attendance } from 'app/models/';

@Injectable()
export class AttendanceClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getAttendances(year?: string, classId?: number, pupilId?: number, from?: string, to?: string): Observable<Attendance[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set("year", year);
    }
    if (classId) {
      params = params.set("class", classId.toString());
    }
    if (pupilId) {
      params = params.set("name", pupilId.toString());
    }
    if (from) {
      params = params.set("from", from);
    }
    if (to) {
      params = params.set("to", to);
    }    
    return this.http.get<Attendance[]>(environment.api.baseURI + '/attendances', { headers: this.defaultHeaders, params: params });
  };

  updateAttendance(attendance: FormattedAttendance): Observable<Empty> {
    return this.http.put<Empty>(environment.api.baseURI + '/attendance', {
      pupil: attendance.pupilId,
      date: attendance.date,
      absent: attendance.attendance == 'x',
    }, this.defaultHttpOptions);
  };
}
