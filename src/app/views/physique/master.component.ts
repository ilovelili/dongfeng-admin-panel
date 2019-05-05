import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { PhysiqueClient } from 'app/clients/physique.client';
import { Physique_AgeHeightWeightPMaster, Physique_AgeHeightWeightSDMaster, Physique_BMIMaster, Physique_HeightToWeightPMaster, Physique_HeightToWeightSDMaster } from 'app/models/physique';

@Component({
  templateUrl: './age-height-weight-p-master.component.html',
  styleUrls: [    
    '../../../scss/vendors/toastr/toastr.scss',
    './physique.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AgeHeightWeightPMasterComponent extends ViewComponent implements OnInit {
  constructor(private physiqueClient: PhysiqueClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.getmasters();
  }

  getmasters() {
    this.loading = true;
    this.physiqueClient.getAgeHeightWeightPMaster().
      subscribe(
        d => {
          this.loading = false;
          this.items = d.masters.map(m => new Physique_AgeHeightWeightPMaster(m.id, m.height_or_weight, m.gender, m.age_min, m.age_max, m.p3, m.p10, m.p20, m.p50, m.p80, m.p97));
        },
        e => this.LogError(e, '获取体格发育五项指标信息失败,请重试'),
        () => this.LogComplete('physique master component age height weight p master loading completed')
      );
  }
}

@Component({
  templateUrl: './age-height-weight-sd-master.component.html',
  styleUrls: [    
    '../../../scss/vendors/toastr/toastr.scss',
    './physique.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AgeHeightWeightSDMasterComponent extends ViewComponent implements OnInit {
  constructor(private physiqueClient: PhysiqueClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.getmasters();
  }

  getmasters() {
    this.loading = true;
    this.physiqueClient.getAgeHeightWeightSDMaster().
      subscribe(
        d => {
          this.loading = false;
          this.items = d.masters.map(m => new Physique_AgeHeightWeightSDMaster(m.id, m.height_or_weight, m.gender, m.age, m.sdm2, m.sdm1, m.avg, m.sd1, m.sd2));
        },
        e => this.LogError(e, '获取生长迟缓标准表信息失败,请重试'),
        () => this.LogComplete('physique master component age height weight sd master loading completed')
      );
  }
}

@Component({
  templateUrl: './bmi-master.component.html',
  styleUrls: [    
    '../../../scss/vendors/toastr/toastr.scss',
    './physique.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class BMIMasterComponent extends ViewComponent implements OnInit {
  constructor(private physiqueClient: PhysiqueClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.getmasters();
  }

  getmasters() {
    this.loading = true;
    this.physiqueClient.getBMIMaster().
      subscribe(
        d => {
          this.loading = false;
          this.items = d.masters.map(m => new Physique_BMIMaster(m.id, m.gender, m.age, m.avg, m.sd1, m.sd2, m.sd3));
        },
        e => this.LogError(e, '获取BMI指标标准表信息失败,请重试'),
        () => this.LogComplete('physique master component bmi master loading completed')
      );
  }
}

@Component({
  templateUrl: './height-to-weight-p-master.component.html',
  styleUrls: [    
    '../../../scss/vendors/toastr/toastr.scss',
    './physique.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HeightToWeightPMasterComponent extends ViewComponent implements OnInit {
  constructor(private physiqueClient: PhysiqueClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.getmasters();
  }

  getmasters() {
    this.loading = true;
    this.physiqueClient.getHeightToWeightPMaster().
      subscribe(
        d => {
          this.loading = false;
          this.items = d.masters.map(m => new Physique_HeightToWeightPMaster(m.id, m.gender, m.height, m.p3, m.p10, m.p20, m.p50, m.p80, m.p97));
        },
        e => this.LogError(e, '获取身高测体重对照表信息失败,请重试'),
        () => this.LogComplete('physique master component height to weight p master loading completed')
      );
  }
}

@Component({
  templateUrl: './height-to-weight-sd-master.component.html',
  styleUrls: [    
    '../../../scss/vendors/toastr/toastr.scss',
    './physique.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HeightToWeightSDMasterComponent extends ViewComponent implements OnInit {
  constructor(private physiqueClient: PhysiqueClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.getmasters();
  }

  getmasters() {
    this.loading = true;
    this.physiqueClient.getHeightToWeightSDMaster().
      subscribe(
        d => {
          this.loading = false;
          this.items = d.masters.map(m => new Physique_HeightToWeightSDMaster(m.id, m.gender, m.height, m.sdm3, m.sdm2, m.sdm1, m.sd0, m.sd1, m.sd2, m.sd3));
        },
        e => this.LogError(e, '获取身高别体重标准表信息失败,请重试'),
        () => this.LogComplete('physique master component height to weight sd master loading completed')
      );
  }
}
