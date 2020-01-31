import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Recipes, FormattedIngredient, Ingredients, Ingredient } from 'app/models/meal';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/auth.service';

@Component({
  templateUrl: './ingredient.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './ingredient.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IngredientComponent extends ViewComponent implements OnInit {
  @ViewChild('recipeModal') recipeModal
  @ViewChild('matchModal') matchModal

  private recipes: Recipes;
  private recipe_names: string = '';  
  private _recipes: string[];
  private currentItem: FormattedIngredient;

  private query: string = '';
  private matchurl: string = '';

  constructor(private mealClient: MealClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.recipe_names = this.params["recipes"];
    this.dateFrom = '';
    this.dateTo = '';
    this.matchurl = `${environment.api.baseURI}/ingredient/names`;
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
        e => this.LogError(e, '获取食材信息失败，请重试'),
        () => this.LogComplete('ingredient component ingredients loading completed')
      );
  }

  showrecipes(item: FormattedIngredient, e: Event) {
    e.preventDefault();
    this.loading = true;
    this.currentItem = item;
    this.mealClient.getRecipes("").
      subscribe(
        d => {
          this.loading = false;
          let r = new Recipes(d.recipes).format_ingredient().find(i => i.ingredient == this.currentItem.ingredient);
          this._recipes = r.recipes.split(',');
          this.recipeModal.show();
        },
        e => {
          this.loading = false;
          this.LogError(e, '获取食材信息失败，请重试');
        },
        () => this.LogComplete('ingredient component ingredients loading completed')
      );
  }

  match(item: FormattedIngredient, e: Event) {
    e.preventDefault();    
    this.currentItem = item;
    this.query = item.ingredient;
    this.matchModal.show();
  }

  updatematch(result: string) {
    this.query = result;
    let i = this.currentItem;    

    this.mealClient.updateIngredient(new Ingredient(
      result,
      i.category,
      i.ingredient,
      i.protein_100g,
      i.protein_daily,
      i.fat_100g,
      i.fat_daily,
      i.carbohydrate_100g,
      i.carbohydrate_daily,
      i.heat_100g,
      i.heat_daily,
      i.calcium_100g,
      i.calcium_daily,
      i.iron_100g,
      i.iron_daily,
      i.zinc_100g,
      i.zinc_daily,
      i.va_100g,
      i.va_daily,
      i.vb1_100g,
      i.vb1_daily,
      i.vb2_100g,
      i.vb2_daily,
      i.vc_100g,
      i.vc_daily
    )).
    subscribe(
      d => {
        this.matchModal.hide();
        this.LogSuccess('匹配成功');
        // refresh
        this.getrecipes();
      },
      e => {
        // todo: fix
        // if (e.error.custom_code == ErrorCode.InvalidIngredientCategory) {
        //   this.LogError(e, '匹配失败,无效的食材类别');
        // } else {
        //   this.LogError(e, '匹配失败,请重试');
        // }
      },
      () => this.LogComplete('ingredient component ingredients matching completed')
    );
  }
}
