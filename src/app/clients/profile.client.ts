import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Profiles, Profile } from 'app/models/profile';
import { Empty } from 'app/models';

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

  createProfile(profile: Profile): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/profile/create', {
      year: profile.year,
      class: profile.class,
      name: profile.name,
      date: profile.date,
    }, this.defaultHttpOptions);
  };

  deleteProfile(profile: Profile): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/profile/delete', {
      year: profile.year,
      class: profile.class,
      name: profile.name,
      date: profile.date,
    }, this.defaultHttpOptions);
  };
}