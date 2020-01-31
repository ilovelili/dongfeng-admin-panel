import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Empty, Constant } from 'app/models/';
import { Physique, Physique_AgeHeightWeightPMaster, Physique_AgeHeightWeightSDMaster, Physique_BMIMaster, Physique_HeightToWeightPMaster, Physique_HeightToWeightSDMaster } from 'app/models/physique';

@Injectable()
export class PhysiqueClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getPhysiques(year?: string, classId?: number, pupilId?: number): Observable<Physique[]> {
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

    return this.http.get<Physique[]>(environment.api.baseURI + '/physiques', { headers: this.defaultHeaders, params: params });
  };

  updatePhysique(physique: Physique): Observable<Empty> {    
    physique.weight = window.parseFloat(physique.weight.toString());
    physique.height = window.parseFloat(physique.height.toString());
    return this.http.put<Empty>(environment.api.baseURI + '/physique', physique, this.defaultHttpOptions);
  };
    
  getAgeHeightWeightPMaster(): Observable<Physique_AgeHeightWeightPMaster[]> {
    let params = new HttpParams();
    params = params.set("id", Constant.Instance.masters["age_height_weight_p"]);
    return this.http.get<Physique_AgeHeightWeightPMaster[]>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }

  getAgeHeightWeightSDMaster(): Observable<Physique_AgeHeightWeightSDMaster[]> {
    let params = new HttpParams();
    params = params.set("id", Constant.Instance.masters["age_height_weight_sd"]);
    return this.http.get<Physique_AgeHeightWeightSDMaster[]>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }

  getBMIMaster(): Observable<Physique_BMIMaster[]> {
    let params = new HttpParams();
    params = params.set("id", Constant.Instance.masters["bmi"]);
    return this.http.get<Physique_BMIMaster[]>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }

  getHeightToWeightPMaster(): Observable<Physique_HeightToWeightPMaster[]> {
    let params = new HttpParams();
    params = params.set("id", Constant.Instance.masters["height_to_weight_p"]);
    return this.http.get<Physique_HeightToWeightPMaster[]>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }

  getHeightToWeightSDMaster(): Observable<Physique_HeightToWeightSDMaster[]> {
    let params = new HttpParams();
    params = params.set("id", Constant.Instance.masters["height_to_weight_sd"]);
    return this.http.get<Physique_HeightToWeightSDMaster[]>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }  
}