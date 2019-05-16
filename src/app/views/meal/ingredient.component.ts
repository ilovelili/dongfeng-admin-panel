import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Recipes, FormattedIngredient } from 'app/models/meal';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients/meal.client';

@Component({
  templateUrl: './ingredient.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',    
    './ingredient.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IngredientComponent extends ViewComponent implements OnInit {
  private recipes: Recipes;
  private recipe_names: string;

  @ViewChild('recipeModal') recipeModal
  private _ingredient: string;
  private _recipes: string[];

  constructor(private mealClient: MealClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
    this.recipe_names = this.params["recipes"];
    this.dateFrom = '';
    this.dateTo = '';
  }

  ngOnInit(): void {
    this.getrecipes();
  }

  getrecipes() {
    this.loading = true;    

    this.mealClient.getRecipes(this.recipe_names).
      subscribe(
        d => {
          this.loading = false;
          this.recipes = new Recipes(d.recipes);
          this.items = this.recipes.format_ingredient();
        },
        e => this.LogError(e, '获取原料信息失败，请重试'),
        () => this.LogComplete('ingredient component ingredients loading completed')
      );
  }

  showrecipes(item: FormattedIngredient, e: Event) {
    e.preventDefault();
    this._ingredient = item.ingredient,

    this.mealClient.getRecipes("").
      subscribe(
        d => {          
          let r = new Recipes(d.recipes).format_ingredient().find(i => i.ingredient == this._ingredient);
          this._recipes = r.recipes.split(',');
          this.recipeModal.show();
        },
        e => this.LogError(e, '获取原料信息失败，请重试'),
        () => this.LogComplete('ingredient component ingredients loading completed')
      );
  }
}
