import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Recipes, FormattedIngredient, Ingredients, Ingredient } from 'app/models/meal';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients/meal.client';

@Component({
  templateUrl: './ingredient-nutrition.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './ingredient-nutrition.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IngredientNutritionComponent extends ViewComponent implements OnInit {
  private ingredients: Ingredients;
  private _ingredients: string;

  constructor(private mealClient: MealClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
    this._ingredients = this.params["ingredients"];
  }

  ngOnInit(): void {
    this.getingredients();
  }

  getingredients() {
    this.loading = true;

    this.mealClient.getIngredients(this._ingredients).
      subscribe(
        d => {
          this.loading = false;
          this.ingredients = new Ingredients(d.ingredients);
          this.items = this.ingredients.ingredients;
        },
        e => this.LogError(e, '获取原料信息失败，请重试'),
        () => this.LogComplete('ingredient nutrition component ingredient nutritions loading completed')
      );
  }

  updateingredient(item: Ingredient) {
    this.loading = true;

    // keep original fields
    let i = (<any>item).original;
    i.alias = item.alias;

    this.mealClient.updateIngredient(i).
      subscribe(
        _ => {
          this.LogSuccess('匹配成功');
          // get updated ingredients
          this.getingredients();
        },
        e => {
          this.LogError(e, '匹配失败,请重试');
          this.loading = false;
          // revert
          let idx = this.items.findIndex(i => i.ingredient == item.ingredient);
          this.items[idx] = (<any>item).original;
        },
        () => this.LogComplete('ingredient nutrition component nutrition upload completed')
      );
  }
}
