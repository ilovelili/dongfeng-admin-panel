import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrowthProfileComponent } from './growth-profile.component';
import { EBookComponent } from './ebook.component';
import { GrowthProfileTemplateComponent } from './growth-profile-template.component';
import { GrowthProfileTemplateDetailComponent } from './growth-profile-template-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '成长档案'
    },
    children: [
      {
        path: '',
        component: GrowthProfileComponent,
        data: {
          title: '编辑成长档案'
        },
      },      
      {
        path: '电子书',
        component: EBookComponent,
        data: {
          title: '电子书',
        },
      },
      {
        path: '模板',
        data: {
          title: '成长档案模板',
        },
        children: [
          {
            path: '',
            component: GrowthProfileTemplateComponent,
          },
          {
            path: ':name',
            component: GrowthProfileTemplateDetailComponent,
          }
        ],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrowthProfileRoutingModule { }