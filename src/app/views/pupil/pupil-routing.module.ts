import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PupilComponent } from './pupil.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '园儿信息'
    },
    children: [      
      {
        path: '',
        component: PupilComponent,
        data: {
          title: '园儿信息',
        }
      },
      {
        path: ':class',
        component: PupilComponent,
        data: {
          title: '园儿信息',
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PupilRoutingModule { }