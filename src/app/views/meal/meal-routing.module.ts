import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { IngredientComponent } from './ingredient.component';
import { RecipeComponent } from './recipe.component';
import { IngredientNutritionComponent } from './ingredient-nutrition.component';

const routes: Routes = [
  {
    path: '',    
    data: {
      title: '膳食管理',
    },
    children: [
      {
        path: '',
        redirectTo: '本周食谱'
      },
      {
        path: '本周食谱',
        component: MenuComponent,
        data: {
          title: '本周食谱',
        },
      },
      {
        path: '食谱信息',
        redirectTo: '食谱信息/',
      },
      {
        path: '食谱信息/:recipes',
        component: RecipeComponent,
        data: {
          title: '食谱信息',
        },
      },
      {
        path: '食材信息',
        redirectTo: '食材信息/',
      },
      {
        path: '食材信息/:recipes',
        component: IngredientComponent,
        data: {
          title: '食材信息',
        },
      },      
      {
        path: '食物营养成分表',
        component: IngredientNutritionComponent,
        data: {
          title: '食物营养成分表',
        },
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MealRoutingModule { }
