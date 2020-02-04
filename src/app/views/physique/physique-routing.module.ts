import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhysiqueComponent } from './physique.component';
import { AgeHeightWeightPMasterComponent, AgeHeightWeightSDMasterComponent, BMIMasterComponent, HeightToWeightPMasterComponent, HeightToWeightSDMasterComponent } from './master.component';

const routes: Routes = [
  {
    path: '',    
    data: {
      title: '体格发育'
    },
    children: [
      {
        path: '',
        component: PhysiqueComponent,
        data: {
          title: '',
        }
      },
      {
        path: ':name',
        component: PhysiqueComponent,
        data: {
          title: '',
        }
      },
      {
        path: '标准数据/五项指标对照表',
        component: AgeHeightWeightPMasterComponent,
        data: {
          title: '五项指标对照表',
        }
      },
      {
        path: '标准数据/生长迟缓标准表',
        component: AgeHeightWeightSDMasterComponent,
        data: {
          title: '生长迟缓标准表',
        }
      },
      {
        path: '标准数据/BMI指标对照表',
        component: BMIMasterComponent,
        data: {
          title: 'BMI指标对照表',
        }
      },
      {
        path: '标准数据/身高测体重对照表',
        component: HeightToWeightPMasterComponent,
        data: {
          title: '身高测体重对照表',
        }
      },
      {
        path: '标准数据/身高别体重标准表',
        component: HeightToWeightSDMasterComponent,
        data: {
          title: '身高别体重标准表',
        }
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysiqueRoutingModule { }
