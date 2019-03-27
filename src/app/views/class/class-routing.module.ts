import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassComponent } from './class.component';



const routes: Routes = [
  {
    path: '',
    component: ClassComponent,
    data: {
      title: '班级管理'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassRoutingModule { }
