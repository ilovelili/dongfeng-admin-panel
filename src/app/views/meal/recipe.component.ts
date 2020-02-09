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
  private recipeIds: string;
  constructor(private mealClient: MealClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
    this.recipeIds = this.params["recipes"];
    // overwrite date otherwise csv filename will append date automatically
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
            this.items = d.filter((r: Recipe) => r.name != '未排菜').map((r: Recipe) => new Recipe(
              r.id,
              r.name,
              r.ingredients,
              r.nutrition,
            ));
          } else {
            this.LogWarning('没有食谱数据');
          }

          this.loading = false;
        },
        e => this.LogError(e, '获取食谱信息失败，请重试'),
        () => this.LogComplete('recipe component recipes loading completed')
      );
  }
}
