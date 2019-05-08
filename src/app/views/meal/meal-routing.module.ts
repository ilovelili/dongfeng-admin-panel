import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';

const routes: Routes = [
  {
    path: '',
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
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MealRoutingModule { }
