import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { ClassList } from 'app/models/class';

@Injectable()
export class ClassClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getClasslist(): Observable<ClassList> {
    return this.http.get<ClassList>(environment.api.baseURI + '/classlist', {headers: this.defaultHeaders});
  };
}
