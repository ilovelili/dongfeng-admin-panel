import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAdminComponent } from './user-admin.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '后台管理'
    },
    children: [
      {
        path: '用户管理',
        component: UserAdminComponent,
        data: {
          title: '用户管理',
        }
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
