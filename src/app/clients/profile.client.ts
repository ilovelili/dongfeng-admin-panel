import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Profiles } from 'app/models/profile';

@Injectable()
export class ProfileClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getProfiles(year?: string, cls?: string, name?: string, date?: string): Observable<Profiles> {
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
    if (date && date != "") {
      params = params.set("date", date);
    }

    return this.http.get<Profiles>(environment.api.baseURI + '/profiles', { headers: this.defaultHeaders, params: params });
  }
}