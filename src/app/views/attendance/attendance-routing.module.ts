import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './attendance.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '出勤信息'
    },
    children: [
      {
        path: '',
        component: AttendanceComponent,
        data: {
          title: ''
        }
      },
      {
        path: ':class/:name',
        component: AttendanceComponent,
        data: {
          title: ''
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
