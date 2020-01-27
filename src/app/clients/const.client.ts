import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Constant } from 'app/models/const';

@Injectable()
export class ConstClient extends BaseClient {
    constructor(protected http: HttpClient) {
        super(http);
    }

    getConsts(): Observable<Constant> {
        return this.http.get<Constant>(environment.api.baseURI + '/const.json', { headers: this.defaultHeaders });
    };
}
