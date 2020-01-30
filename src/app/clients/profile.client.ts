import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Profiles, Profile } from 'app/models/profile';
import { Empty, Ebooks } from 'app/models';
import { ProfileTemplates, ProfileTemplate } from 'app/models/profile_template';

@Injectable()
export class ProfileClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getProfiles(year?: string, classId?: number, pupilId?: number, date?: string): Observable<Profiles> {
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
    if (date) {
      params = params.set("date", date);
    }

    return this.http.get<Profiles>(environment.api.baseURI + '/profiles', {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  getProfileTemplate(name: string): Observable<ProfileTemplate> {
    let params = new HttpParams();
    params = params.set("name", name);
    return this.http.get<ProfileTemplate>(environment.api.baseURI + '/profiletemplate', {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  getProfileTemplates(): Observable<ProfileTemplates> {
    return this.http.get<ProfileTemplates>(environment.api.baseURI + '/profiletemplates', {
      headers: this.defaultHeaders,
    });
  }

  createProfileTemplate(name: string): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/profiletemplate', {
      name: name,
      enabled: true,
    }, this.defaultHttpOptions);
  }

  deleteProfileTemplate(name: string): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/profiletemplate', {
      name: name,
      enabled: false,
    }, this.defaultHttpOptions);
  }

  createProfile(profile: Profile): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/profile/create', {
      year: profile.year,
      class: profile.class,
      name: profile.name,
      date: profile.date,
      template: profile.template,
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

  getPrevProfile(year?: string, classId?: number, pupilId?: number, date?: string): Observable<Profile> {
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
    if (date) {
      params = params.set("date", date);
    }

    return this.http.get<Profile>(environment.api.baseURI + '/profile/prev', {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  getNextProfile(year?: string, classId?: number, pupilId?: number, date?: string): Observable<Profile> {
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
    if (date) {
      params = params.set("date", date);
    }

    return this.http.get<Profile>(environment.api.baseURI + '/profile/next', {
      headers: this.defaultHeaders,
      params: params,
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

  getEbooks(year?: string, classId?: number, pupilId?: number): Observable<Ebooks> {
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

    return this.http.get<Ebooks>(environment.api.baseURI + '/ebooks', {
      headers: this.defaultHeaders,
      params: params,
    });
  }
}