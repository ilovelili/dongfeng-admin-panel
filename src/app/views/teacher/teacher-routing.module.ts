import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherComponent } from './teacher.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '教师信息'
    },
    children: [
      {
        path: '',
        component: TeacherComponent,
        data: {
          title: ''
        },
      },
      {
        path: ':class',
        component: TeacherComponent,
        data: {
          title: ''
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
