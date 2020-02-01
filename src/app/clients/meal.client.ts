import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClient } from './base.client';
import { environment } from 'environments/environment';
import { Recipes, Ingredient, Empty, Procurements, FormattedProcurement, Menu } from 'app/models';

@Injectable()
export class MealClient extends BaseClient {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getMenus(junior_or_senior: number, breakfast_or_lunch: number, from?: string, to?: string): Observable<Menu[]> {
    let params = new HttpParams();
    params = params.set("junior_or_senior", junior_or_senior.toString());
    params = params.set("breakfast_or_lunch", breakfast_or_lunch.toString());
    
    if (from) {
      params = params.set("from", from);
    }

    if (to) {
      params = params.set("to", to);
    }

    return this.http.get<Menu[]>(environment.api.baseURI + '/menus', { headers: this.defaultHeaders, params: params });
  }

  getRecipes(recipes: string): Observable<Recipes> {
    let params = new HttpParams();

    if (recipes && recipes != "") {
      params = params.set("recipes", recipes);
    }

    return this.http.get<Recipes>(environment.api.baseURI + '/recipes', { headers: this.defaultHeaders, params: params });
  }

  getIngredients(ingredients: string): Observable<Ingredient[]> {
    let params = new HttpParams();

    if (ingredients) {
      params = params.set("ingredients", ingredients);
    }

    return this.http.get<Ingredient[]>(environment.api.baseURI + '/ingredients', { headers: this.defaultHeaders, params: params });
  }

  updateIngredient(ingredient: Ingredient): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/ingredient', ingredient, this.defaultHttpOptions);
  };

  getProcurements(from?: string, to?: string): Observable<Procurements> {
    let params = new HttpParams();

    if (from) {
      params = params.set("from", from);
    }
    if (to) {
      params = params.set("to", to);
    }

    return this.http.get<Procurements>(environment.api.baseURI + '/procurements', { headers: this.defaultHeaders, params: params });
  }

  updateProcurement(procurement: FormattedProcurement): Observable<Empty> {
    return this.http.post<Empty>(environment.api.baseURI + '/procurement', procurement, this.defaultHttpOptions);
  };
}
