import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Pupil } from 'app/models/pupil';

@Injectable()
export class PupilClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }
  
  getPupils(year?: string, classId?: number): Observable<Pupil[]> {
    let params = new HttpParams();

    if (year) {
      params = params.set("year", year);
    }
    if (classId) {
      params = params.set("class", classId.toString());
    }

    return this.http.get<Pupil[]>(environment.api.baseURI + '/pupils', { headers: this.defaultHeaders, params: params });
  };
}
