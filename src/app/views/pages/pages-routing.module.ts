import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { PasswordComponent } from './password.component';
import { OpenIdDingTalkComponent } from './openid-dingtalk.component';

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
      {
        path: '注册',
        component: RegisterComponent,
        data: {
          title: '注册'
        }
      },
      {
        path: '重置密码',
        component: PasswordComponent,
        data: {
          title: '重置密码'
        }
      },
      {
        path: 'dingtalk',
        component: OpenIdDingTalkComponent,
        data: {
          title: '第三方登录-钉钉'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
