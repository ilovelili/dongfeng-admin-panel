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
        loadChildren: () => import('./views/growth-profile/growth-profile.module').then(m => m.GrowthProfileModule),
      },
      {
        path: '用户信息',
        loadChildren: () => import('./views/user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      {
        path: '班级信息',
        loadChildren: () => import('./views/class/class.module').then(m => m.ClassModule),
      },
      {
        path: '幼儿信息',
        loadChildren: () => import('./views/pupil/pupil.module').then(m => m.PupilModule),
      },
      {
        path: '教师信息',
        loadChildren: () => import('./views/teacher/teacher.module').then(m => m.TeacherModule),
      },
      {
        path: '出勤信息',
        loadChildren: () => import('./views/attendance/attendance.module').then(m => m.AttendanceModule),
      },      
      {
        path: '体格发育',
        loadChildren: () => import('./views/physique/physique.module').then(m => m.PhysiqueModule),
      },
      {
        path: '膳食管理',
        loadChildren: () => import('./views/meal/meal.module').then(m => m.MealModule),
      },
      {
        path: '后台管理',
        loadChildren: () => import('./views/admin/admin.module').then(m => m.AdminModule),
      },
    ]
  },
  {
    path: '页面',
    component: SimpleLayoutComponent,    
    children: [
      {
        path: '',
        loadChildren: () => import('./views/pages/pages.module').then(m => m.PagesModule),
      },
    ]
  },
  {
    path: 'openid',
    component: SimpleLayoutComponent,    
    children: [
      {
        path: '',
        loadChildren: () => import('./views/pages/pages.module').then(m => m.PagesModule),
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