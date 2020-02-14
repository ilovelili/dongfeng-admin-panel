import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent,
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '页面/登录',
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
        path: '成长档案',
        loadChildren: './views/growth-profile/growth-profile.module#GrowthProfileModule',
      },
      {
        path: '用户信息',
        loadChildren: './views/user-profile/user-profile.module#UserProfileModule',
      },
      {
        path: '班级信息',
        loadChildren: './views/class/class.module#ClassModule',
      },
      {
        path: '幼儿信息',
        loadChildren: './views/pupil/pupil.module#PupilModule',
      },
      {
        path: '教师信息',
        loadChildren: './views/teacher/teacher.module#TeacherModule',
      },
      {
        path: '出勤信息',
        loadChildren: './views/attendance/attendance.module#AttendanceModule',
      },      
      {
        path: '体格发育',
        loadChildren: './views/physique/physique.module#PhysiqueModule',
      },
      {
        path: '膳食管理',
        loadChildren: './views/meal/meal.module#MealModule',
      },
      {
        path: '后台管理',
        loadChildren: './views/admin/admin.module#AdminModule',
      },
    ]
  },
  {
    path: '页面',
    component: SimpleLayoutComponent,    
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      },
    ]
  },
  {
    path: 'openid',
    component: SimpleLayoutComponent,    
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      },
    ]
  },
  {
    path: '**',
    redirectTo: '页面/404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }