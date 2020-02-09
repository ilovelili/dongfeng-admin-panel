import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients';
import { AuthService } from 'app/services/auth.service';
import { Ingredient } from 'app/models';

@Component({
  templateUrl: './ingredient-nutrition.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    '../../../scss/vendors/file-uploader/file-uploader.scss',
    './ingredient-nutrition.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IngredientNutritionComponent extends ViewComponent implements OnInit {
  private ingredients: Ingredient[];
  private _ingredients: string;
  private displayMode = "每100g";

  constructor(private mealClient: MealClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
    this._ingredients = this.params["ingredients"];
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'ingredients', '食物营养成分表');
    this.initfileuploader(this.fileUploader2, 'ingredients', '食物营养成分表');

    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getingredients();
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      });

    this.template = [
      {
        id: 1,
        ingredient: "稻米",
        categoryName: "大米",
        protein_100g: 7.4,
        protein_daily: 7.5897,
        fat_100g: 0.8,
        fat_daily: 0.8205,
        carbohydrate_100g: 77.2,
        carbohydrate_daily: 79.1795,
        heat_100g: 346,
        heat_daily: 354.8718,
        calcium_100g: 13,
        calcium_daily: 13.3333,
        iron_100g: 2.3,
        iron_daily: 2.3590,
        zinc_100g: 1.7,
        zinc_daily: 1.7436,
        va_100g: 0,
        va_daily: 0,
        vb1_100g: 0,
        vb1_daily: 0,
        vb2_100g: 0,
        vb2_daily: 0,
        vc_100g: 0,
        vc_daily: 0,
      },
      {
        id: 2,
        ingredient: "紫菜",
        categoryName: "菌藻类",
        protein_100g: 7.4,
        protein_daily: 7.5897,
        fat_100g: 0.8,
        fat_daily: 0.8205,
        carbohydrate_100g: 77.2,
        carbohydrate_daily: 79.1795,
        heat_100g: 346,
        heat_daily: 354.8718,
        calcium_100g: 13,
        calcium_daily: 13.3333,
        iron_100g: 2.3,
        iron_daily: 2.3590,
        zinc_100g: 1.7,
        zinc_daily: 1.7436,
        va_100g: 0,
        va_daily: 0,
        vb1_100g: 0,
        vb1_daily: 0,
        vb2_100g: 0,
        vb2_daily: 0,
        vc_100g: 0,
        vc_daily: 0,
      },
    ];
  }

  getingredients() {
    this.loading = true;
    this.mealClient.getIngredients(this._ingredients).
      subscribe(
        d => {
          this.ingredients = d;
          this.items = this.ingredients.map(i => new Ingredient(
            i.id,
            i.ingredient,
            i.category,
            i.alias,
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
            i.vc_daily,
            i.recipes
          ));

          this.loading = false;
        },
        e => {
          this.LogError(e, '获取食材信息失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('ingredient nutrition component ingredient nutritions loading completed')
      );
  }

  displaydaily() {
    this.displayMode = "每人日";
  }

  display100g() {
    this.displayMode = "每100g";
  }
}
