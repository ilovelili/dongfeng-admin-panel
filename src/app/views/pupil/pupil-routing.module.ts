import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PupilComponent } from './pupil.component';

const routes: Routes = [
  {
    path: '',    
    data: {
      title: '幼儿信息'
    },
    children: [
      {
        path: '',
        component: PupilComponent,
        data: {
          title: '',
        }
      },
      {
        path: ':class',
        component: PupilComponent,
        data: {
          title: '',
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