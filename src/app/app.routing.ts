import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent,
} from './containers';
import { AuthGuard } from './auth/auth.guard';
import { CallbackComponent } from './callback/callback.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: '首页'
    },
    children: [
      {
        path: 'growth-profile',
        loadChildren: './views/growth-profile/growth-profile.module#GrowthProfileModule',
      },
      {
        path: 'user-profile',
        loadChildren: './views/user-profile/user-profile.module#UserProfileModule',
      },
    ]
  },
  {
    path: 'pages',
    component: SimpleLayoutComponent,    
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      },
    ]
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  {
    path: 'null',
    redirectTo: 'pages/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
