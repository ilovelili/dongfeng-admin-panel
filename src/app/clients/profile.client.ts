import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Empty, Ebook, Profile } from 'app/models';
import { ProfileTemplate } from 'app/models';

@Injectable()
export class ProfileClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getProfileTemplates(): Observable<ProfileTemplate[]> {
    return this.http.get<ProfileTemplate[]>(environment.api.baseURI + '/profileTemplates', {
      headers: this.defaultHeaders,
    });
  }

  createProfileTemplate(name: string): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + `/profileTemplate?name=${name}`, {}, this.defaultHttpOptions);
  }

  deleteProfileTemplate(name: string): Observable<Empty> {
    let params = new HttpParams();
    params = params.set("name", name);
    return this.http.delete<Empty>(environment.api.baseURI + '/profileTemplate', {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  getProfileTemplateTags(name: string): Observable<string> {
    let params = new HttpParams();
    params = params.set("name", name);
    return this.http.get<string>(environment.api.baseURI + '/profileTemplateTags', {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  updateProfileTemplateTags(name: string, tags: string): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + `/profileTemplateTags?name=${name}&tags=${tags}`, {}, this.defaultHttpOptions);
  }

  getProfiles(year: string): Observable<Profile[]> {
    let params = new HttpParams();
    params = params.set("year", year);
    return this.http.get<Profile[]>(environment.api.baseURI + '/profiles', {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  createProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(environment.api.baseURI + '/profile', {
      pupil_id: profile.pupil_id,
      date: profile.date,
      template_id: profile.template_id,
    }, this.defaultHttpOptions);
  };

  deleteProfile(id: number): Observable<Empty> {
    let params = new HttpParams();
    params = params.set("id", id.toString());
    return this.http.delete<Empty>(environment.api.baseURI + '/profile', {
      headers: this.defaultHeaders,
      params: params,
    });
  };

  getPrevProfile(pupilId: number, date: string): Observable<Profile> {
    let params = new HttpParams();
    params = params.set("name", pupilId.toString());
    params = params.set("date", date);
    return this.http.get<Profile>(environment.api.baseURI + '/profile/prev', {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  getNextProfile(pupilId: number, date: string): Observable<Profile> {
    let params = new HttpParams();
    params = params.set("name", pupilId.toString());
    params = params.set("date", date);
    return this.http.get<Profile>(environment.api.baseURI + '/profile/next', {
      headers: this.defaultHeaders,
      params: params,
    });
  }

  convertToTemplate(id: number, templateName: string, tags: string): Observable<Empty> {
    return this.http.post<Profile>(environment.api.baseURI + `/convertProfileToTemplate?id=${id}&templateName=${templateName}&tags=${tags}`, {}, this.defaultHttpOptions);
  }

  updateEBook(profile: Profile, images: string[], html: string, css: string): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/ebook', {
      pupil_id: profile.pupil_id,
      date: profile.date,
      images: images,
      html: html,
      css: css,
    }, this.defaultHttpOptions);
  }

  getEbooks(year?: string, classId?: number, pupilId?: number): Observable<Ebook[]> {
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

    return this.http.get<Ebook[]>(environment.api.baseURI + '/ebooks', {
      headers: this.defaultHeaders,
      params: params,
    });
  }
}