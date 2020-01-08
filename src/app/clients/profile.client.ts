import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Profiles, Profile } from 'app/models/profile';
import { Empty, Ebooks } from 'app/models';
import { ProfileTemplates } from 'app/models/profile_template';

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

    return this.http.get<Profiles>(environment.api.baseURI + '/profiles', {
      headers: this.defaultHeaders,
      params: params,
      withCredentials: false,
    });
  }

  getProfileTemplates(id?: number): Observable<ProfileTemplates> {
    let params = new HttpParams();

    if (id && id != 0) {
      params = params.set("id", id.toString());
    }

    return this.http.get<ProfileTemplates>(environment.api.baseURI + '/profiletemplates', {
      headers: this.defaultHeaders,
      params: params,
      withCredentials: false,
    });
  }

  createProfileTemplate(name: string): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/profiletempalte/create', {
      name: name,
    }, this.defaultHttpOptions);
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

  getPrevProfile(year?: string, cls?: string, name?: string, date?: string): Observable<Profile> {
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

    return this.http.get<Profile>(environment.api.baseURI + '/profile/prev', {
      headers: this.defaultHeaders,
      params: params,
      withCredentials: false,
    });
  }

  getNextProfile(year?: string, cls?: string, name?: string, date?: string): Observable<Profile> {
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

    return this.http.get<Profile>(environment.api.baseURI + '/profile/next', {
      headers: this.defaultHeaders,
      params: params,
      withCredentials: false,
    });
  }

  updateEBook(profile: Profile, images: string[], html: string, css: string): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/ebook', {
      year: profile.year,
      class: profile.class,
      name: profile.name,
      date: profile.date,
      images: images,
      html: html,
      css: css,
    }, this.defaultHttpOptions);
  }

  getEbooks(year?: string, cls?: string, name?: string): Observable<Ebooks> {
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

    return this.http.get<Ebooks>(environment.api.baseURI + '/ebooks', {
      headers: this.defaultHeaders,
      params: params,
      withCredentials: false,
    });
  }
}