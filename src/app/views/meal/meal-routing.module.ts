import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { IngredientComponent } from './ingredient.component';
import { RecipeComponent } from './recipe.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    data: {
      title: '膳食管理',
    },    
    children: [      
      {
        path: '本周食谱',
        component: MenuComponent,
        data: {
          title: '本周食谱',
        },
      },
      {
        path: '食谱信息',
        component: RecipeComponent,
        data: {
          title: '食谱信息',
        },
      },
      {
        path: '食谱信息/:recipes',
        component: RecipeComponent,
        data: {
          title: '食谱信息',
        },
      },
      {
        path: '原料信息',
        component: IngredientComponent,
        data: {
          title: '原料信息',
        },
      },
      {
        path: '原料信息/:recipes',
        component: IngredientComponent,
        data: {
          title: '原料信息',
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
