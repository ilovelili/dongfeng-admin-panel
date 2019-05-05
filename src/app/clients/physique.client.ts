import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Empty } from 'app/models/';
import { Physiques, Physique, Physique_AgeHeightWeightPMasters, Physique_AgeHeightWeightSDMasters, Physique_BMIMasters, Physique_HeightToWeightPMasters, Physique_HeightToWeightSDMasters } from 'app/models/physique';

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

  private physique_age_height_weight_p_master = "1";
  private physique_age_height_weight_sd_master = "2";
  private physique_bmi_master = "3";
  private physique_height_to_weight_p_master = "4";
  private physique_height_to_weight_sd_master = "5";

  getAgeHeightWeightPMaster(): Observable<Physique_AgeHeightWeightPMasters> {
    let params = new HttpParams();
    params = params.set("id", this.physique_age_height_weight_p_master);
    return this.http.get<Physique_AgeHeightWeightPMasters>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }

  getAgeHeightWeightSDMaster(): Observable<Physique_AgeHeightWeightSDMasters> {
    let params = new HttpParams();
    params = params.set("id", this.physique_age_height_weight_sd_master);
    return this.http.get<Physique_AgeHeightWeightSDMasters>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }

  getBMIMaster(): Observable<Physique_BMIMasters> {
    let params = new HttpParams();
    params = params.set("id", this.physique_bmi_master);
    return this.http.get<Physique_BMIMasters>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }

  getHeightToWeightPMaster(): Observable<Physique_HeightToWeightPMasters> {
    let params = new HttpParams();
    params = params.set("id", this.physique_height_to_weight_p_master);
    return this.http.get<Physique_HeightToWeightPMasters>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }

  getHeightToWeightSDMaster(): Observable<Physique_HeightToWeightSDMasters> {
    let params = new HttpParams();
    params = params.set("id", this.physique_height_to_weight_sd_master);
    return this.http.get<Physique_HeightToWeightSDMasters>(environment.api.baseURI + '/masters', { headers: this.defaultHeaders, params: params });
  }  
}