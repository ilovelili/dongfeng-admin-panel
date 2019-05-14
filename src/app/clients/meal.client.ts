import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Menus, Recipes } from 'app/models';

@Injectable()
export class MealClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getMenus(cls: string, breakfast_or_lunch: string, from?: string, to?: string): Observable<Menus> {
    let params = new HttpParams();

    if (cls == "小班") {
      params = params.set("junior_or_senior", "junior");
    } else if (cls == "中班" || cls == "大班") {
      params = params.set("junior_or_senior", "senior");
    }

    if (breakfast_or_lunch == "点心") {
      params = params.set("breakfast_or_lunch", "snack");
    } else if (breakfast_or_lunch == "午餐") {
      params = params.set("breakfast_or_lunch", "lunch");
    } else if (breakfast_or_lunch == "早餐") {
      params = params.set("breakfast_or_lunch", "breakfast");
    }

    if (from && from != "") {
      params = params.set("from", from);
    }

    if (to && to != "") {
      params = params.set("to", to);
    }

    return this.http.get<Menus>(environment.api.baseURI + '/menus', { headers: this.defaultHeaders, params: params });
  }

  getRecipes(recipes: string): Observable<Recipes> {
    let params = new HttpParams();

    if (recipes && recipes != "") {
      params = params.set("recipes", recipes);
    }

    return this.http.get<Recipes>(environment.api.baseURI + '/recipes', { headers: this.defaultHeaders, params: params });
  }
}
