import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Class } from 'app/models/class';
import { Pupil } from 'app/models/pupil';
import { Teacher } from 'app/models/teacher';
import { Empty } from 'app/models';

@Injectable()
export class ClassClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getClasses(year?: string): Observable<Class[]> {
    let params = new HttpParams();
    if (year && year != "") {
      params = params.set("year", year);
    }

    return this.http.get<Class[]>(environment.api.baseURI + '/classes', { headers: this.defaultHeaders, params: params });
  };

  getPupils(year?: string, cls?: string): Observable<Pupil[]> {
    let params = new HttpParams();

    if (year && year != "") {
      params = params.set("year", year);
    }
    if (cls && cls != "") {
      params = params.set("class", cls);
    }

    return this.http.get<Pupil[]>(environment.api.baseURI + '/pupils', { headers: this.defaultHeaders, params: params });
  };

  getTeachers(year?: string, cls?: string): Observable<Teacher[]> {
    let params = new HttpParams();

    if (year && year != "") {
      params = params.set("year", year);
    }
    if (cls && cls != "") {
      params = params.set("class", cls);
    }

    return this.http.get<Teacher[]>(environment.api.baseURI + '/teachers', { headers: this.defaultHeaders, params: params });
  };
  
  updateTeacher(teacher: Teacher): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/teacher', {
      id: teacher.id,
      name: teacher.name,
      class: teacher.class,
      email: teacher.email,
    }, this.defaultHttpOptions);
  };
}
