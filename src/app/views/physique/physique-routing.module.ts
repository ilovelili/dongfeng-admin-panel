import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhysiqueComponent } from './physique.component';

const routes: Routes = [
  {
    path: '',
    component: PhysiqueComponent,
    data: {
      title: '体格检查'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysiqueRoutingModule { }
