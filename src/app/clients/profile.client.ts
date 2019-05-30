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
    return this.updateProfile(profile, true)
  };

  deleteProfile(profile: Profile): Observable<Empty> {
    return this.updateProfile(profile, false)
  };

  updateProfile(profile: Profile, enabled: boolean): Observable<Empty> {
    let params = new HttpParams();

    if (profile.year != "") {
      params = params.set("year", profile.year);
    }
    if (profile.class != "") {
      params = params.set("class", profile.class);
    }
    if (profile.name != "") {
      params = params.set("name", profile.name);
    }
    if (profile.date != "") {
      params = params.set("date", profile.date);
    }
    
    params = params.set("enabled", enabled+'');

    return this.http.post<Empty>(environment.api.baseURI + '/profile', {}, {
      headers: this.defaultHeaders,
      params: params,
    });
  }
}