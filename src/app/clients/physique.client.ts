import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Empty } from 'app/models/';
import { Physiques, Physique } from 'app/models/physique';

@Injectable()
export class PhysiqueClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getPhysiques(year?: string, cls?: string, name?: string): Observable<Physiques> {
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

    return this.http.get<Physiques>(environment.api.baseURI + '/physiques', { headers: this.defaultHeaders, params: params });
  };

  updatePhysique(physique: Physique): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/physique', physique, this.defaultHttpOptions);
  };
}