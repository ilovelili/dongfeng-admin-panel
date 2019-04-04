import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Classes } from 'app/models/class';
import { Pupils } from 'app/models/pupil';
import { Teachers } from 'app/models/teacher';

@Injectable()
export class ClassClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getClasses(): Observable<Classes> {
    return this.http.get<Classes>(environment.api.baseURI + '/classes', {headers: this.defaultHeaders});
  };

  getPupils(year?: string, cls?: string): Observable<Pupils> {
    let params = new HttpParams();

    if (year && year != "") {
      params = params.set("year", year);
    }
    if (cls && cls != "") {
      params = params.set("class", cls);
    }

    return this.http.get<Pupils>(environment.api.baseURI + '/pupils', {headers: this.defaultHeaders, params: params});
  };

  getTeachers(year?: string, cls?: string): Observable<Teachers> {
    let params = new HttpParams();
    
    if (year && year != "") {
      params = params.set("year", year);
    }
    if (cls && cls != "") {
      params = params.set("class", cls);
    }

    return this.http.get<Teachers>(environment.api.baseURI + '/teachers', {headers: this.defaultHeaders, params: params});
  };
}
