import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients';
import { AuthService } from 'app/services/auth.service';
import { Recipe, Ingredient } from 'app/models';

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

  private recipeIds: string = '';
  private _recipes: Recipe[];
  private currentItem: Ingredient;

  constructor(private mealClient: MealClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.recipeIds = this.params["recipes"];
    this.dateFrom = '';
    this.dateTo = '';
  }

  ngOnInit(): void {
    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getrecipes();
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      });
  }

  getrecipes() {
    this.loading = true;
    this.mealClient.getRecipes(this.recipeIds).
      subscribe(
        d => {
          if (d.length) {
            let recipes = d.filter((r: Recipe) => r.name != '未排菜').map((r: Recipe) => new Recipe(
              r.id,
              r.name,
              r.ingredients,
              r.nutrition
            ));
            this.items = Recipe.toIngredients(recipes);
          } else {
            this.LogWarning('没有食材数据');
          }

          this.loading = false;
        },
        e => this.LogError(e, '获取食材信息失败，请重试'),
        () => this.LogComplete('ingredient component ingredients loading completed')
      );
  }

  showRecipes(item: Ingredient, e: Event) {
    e.preventDefault();
    this.loading = true;
    this.currentItem = item;
    this.mealClient.getRecipes(item.recipeIds).
      subscribe(
        d => {
          this.loading = false;          
          this._recipes = d.filter((r: Recipe) => r.name != '未排菜').map((r: Recipe) => new Recipe(
            r.id,
            r.name,
            r.ingredients,
            r.nutrition
          ));
          this.recipeModal.show();
        },
        e => {
          this.loading = false;
          this.LogError(e, '获取食谱信息失败，请重试');
        },
        () => this.LogComplete('ingredient component recipes loading completed')
      );
  }
}
