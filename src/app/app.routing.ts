import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent,
} from './containers';
import { AuthGuard } from './auth/auth.guard';
import { CallbackComponent } from './components';

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
        path: '成长档案',
        loadChildren: './views/user-profile/user-profile.module#UserProfileModule',
      },
      {
        path: '班级信息',
        loadChildren: './views/class/class.module#ClassModule',
      },
      {
        path: '园儿信息',
        loadChildren: './views/pupil/pupil.module#PupilModule',
      },
      {
        path: '园儿信息/:class',
        loadChildren: './views/pupil/pupil.module#PupilModule',
      },
      {
        path: '教师信息',
        loadChildren: './views/teacher/teacher.module#TeacherModule',
      },
      {
        path: '教师信息/:class',
        loadChildren: './views/teacher/teacher.module#TeacherModule',
      },
      {
        path: '出勤信息',
        loadChildren: './views/attendance/attendance.module#AttendanceModule',
      },      
      {
        path: '出勤信息/:class/:name',
        loadChildren: './views/attendance/attendance.module#AttendanceModule',
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
    path: 'callback',
    component: CallbackComponent,
  },  
  {
    path: '**',
    redirectTo: 'pages/404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
