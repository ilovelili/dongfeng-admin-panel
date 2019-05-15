import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '东风幼儿园'
    },
    children: [
      {
        path: '404',
        component: P404Component,
        data: {
          title: '404'
        }
      },
      {
        path: '500',
        component: P500Component,
        data: {
          title: '500'
        }
      },
      {
        path: '登录',
        component: LoginComponent,
        data: {
          title: '登录'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
