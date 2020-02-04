import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients';
import { AuthService } from 'app/services/auth.service';
import { Recipe } from 'app/models';

@Component({
  templateUrl: './recipe.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',    
    './recipe.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RecipeComponent extends ViewComponent implements OnInit {  
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
          this.items = d.map((r: Recipe) => new Recipe(
            r.name,
            r.ingredients,
            r.carbohydrate,
            r.dietaryfiber,
            r.protein,
            r.fat,r.heat
          ));
        },
        e => this.LogError(e, '获取食谱信息失败，请重试'),
        () => this.LogComplete('recipe component recipes loading completed')
      );
  }

  showingredients(item: Recipe, e: Event) {
    // e.preventDefault();
    // this._ingredients = item.ingredients.split(","),
    // this._recipe = item.recipe;
    // this.ingredientModal.show();
  }
}
