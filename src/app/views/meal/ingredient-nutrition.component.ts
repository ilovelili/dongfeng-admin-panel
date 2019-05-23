import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Ingredients } from 'app/models/meal';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients';
import { ErrorCode } from 'app/models';
import { AuthService } from 'app/auth/auth.service';

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
  private ingredients: Ingredients;
  private _ingredients: string;

  constructor(private mealClient: MealClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.dateFrom = '';
    this.dateTo = '';
    this._ingredients = this.params["ingredients"];
  }

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'ingredients', '食物营养成分表', null, this.errcallback);
    this.initfileuploader(this.fileUploader2, 'ingredients', '食物营养成分表', null, this.errcallback);

    this.getingredients();

    this.template = [
      {
        id: 1,        
        ingredient: "稻米",
        category: "大米",
        protein_100g: 7.4,
        fat_100g: 0.8,
        carbohydrate_100g: 77.2,
        heat_100g: 346,
        calcium_100g: 13,
        iron_100g: 2.3,
        zinc_100g: 1.7,
        va_100g: 0,
        vb1_100g: 0,
        vb2_100g: 0,
        vc_100g: 0,
      },
      { 
        id: 2,       
        ingredient: "紫菜",
        category: "菌藻类",
        protein_100g: 26.7,
        fat_100g: 1.1000,
        carbohydrate_100g: 22.5,
        heat_100g: 207,
        calcium_100g: 264,
        iron_100g: 54.9,
        zinc_100g: 2.5,
        va_100g: 228,
        vb1_100g: 0.3,
        vb2_100g: 1,
        vc_100g: 2,
      },
    ];
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
        e => this.LogError(e, '获取食材信息失败，请重试'),
        () => this.LogComplete('ingredient nutrition component ingredient nutritions loading completed')
      );
  }

  // this must be passed from parent
  errcallback(res: string, me: any) {
    let resjson = JSON.parse(res);
    if (resjson.custom_code == ErrorCode.InvalidPupil) {
      me.LogError(res, '匹配失败,无效的食材类别');
    } else {
      me.LogError(res, '匹配失败,请重试');
    }
  }
}
