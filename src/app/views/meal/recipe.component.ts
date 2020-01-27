import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Recipes, FormattedRecipe } from 'app/models/meal';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients';
import { AuthService } from 'app/services/auth.service';

@Component({
  templateUrl: './recipe.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',    
    './recipe.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RecipeComponent extends ViewComponent implements OnInit {
  private recipes: Recipes;
  private recipe_names: string;

  @ViewChild('ingredientModal') ingredientModal
  private _recipe: string;
  private _ingredients: string[];

  constructor(private mealClient: MealClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.recipe_names = this.params["recipes"];
    // overwrite date otherwise csv filename will append date automatically
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
          this.items = this.recipes.format_recipe();
        },
        e => this.LogError(e, '获取食谱信息失败，请重试'),
        () => this.LogComplete('recipe component recipes loading completed')
      );
  }

  showingredients(item: FormattedRecipe, e: Event) {
    e.preventDefault();
    this._ingredients = item.ingredients.split(","),
    this._recipe = item.recipe;
    this.ingredientModal.show();
  }
}
