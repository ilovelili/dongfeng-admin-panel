import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { GrowthProfileComponent } from './growth-profile.component';

const routes: Routes = [
  {
    path: '',
    component: GrowthProfileComponent,
    data: {
      title: '成长档案'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrowthProfileRoutingModule {}
