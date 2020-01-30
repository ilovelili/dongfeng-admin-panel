import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Teacher } from 'app/models/teacher';
import { Empty } from 'app/models';

@Injectable()
export class TeacherClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getTeachers(year?: string, classId?: number): Observable<Teacher[]> {
    let params = new HttpParams();

    if (year) {
      params = params.set("year", year);
    }
    if (classId) {
      params = params.set("class", classId.toString());
    }

    return this.http.get<Teacher[]>(environment.api.baseURI + '/teachers', { headers: this.defaultHeaders, params: params });
  };

  updateTeacher(teacher: Teacher): Observable<Empty> {
    return this.http.put<Empty>(environment.api.baseURI + '/teacher', {
      id: teacher.id,
      email: teacher.email,
    }, this.defaultHttpOptions);
  };
}
