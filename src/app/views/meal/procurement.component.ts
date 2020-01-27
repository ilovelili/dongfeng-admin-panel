import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Procurements, FormattedProcurement } from 'app/models/meal';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients';
import { AuthService } from 'app/services/auth.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { DateRange } from 'app/models';

@Component({
  templateUrl: './procurement.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './procurement.component.scss',
    '../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ProcurementComponent extends ViewComponent implements OnInit {
  @ViewChild('editModal') editModal
  private procurements: Procurements;
  private edititem: FormattedProcurement = new FormattedProcurement('', 0, 0, '', '', 0);

  constructor(private mealClient: MealClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService, protected localeService: BsLocaleService) {
    super(router, authService, activatedRoute, toasterService, localeService);
    this.dateFrom = this.params["from"] || this.dateToString(this.monday());
    this.dateTo = this.params["to"] || this.dateToString(this.friday());
    this.dateRange = new DateRange(this.dateFrom, this.dateTo).format();
  }

  ngOnInit(): void {
    this.getprocurements();
  }

  getprocurements() {
    this.loading = true;
    this.dateFrom = this.dateToString(this.dateRange[0]);
    this.dateTo = this.dateToString(this.dateRange[1]);

    this.mealClient.getProcurements(this.dateFrom, this.dateTo).
      subscribe(
        d => {
          this.loading = false;
          this.procurements = new Procurements(d.procurements);
          this.items = this.procurements.format();
        },
        e => this.LogError(e, '获取采购信息失败，请重试'),
        () => this.LogComplete('procurement component procurements loading completed')
      );
  }

  updateprocurement(procurement: FormattedProcurement) {
    this.edititem.total = procurement.total;
    this.edititem.amount = procurement.total * 1000 /* kg => g */ / this.edititem.attendance;
    this.loading = true;

    this.mealClient.updateProcurement(this.edititem).
      subscribe(
        d => {
          this.loading = false;
          this.editModal.hide();
          this.LogSuccess('采购信息更新');
        },
        e => {
          this.LogError(e, '采购信息更新失败,请重试');

        },
        () => this.LogComplete('procurement component procurement update completed')
      );
  }

  showedit(item: FormattedProcurement) {
    this.edititem = item;
    this.conditionModal.hide();
    this.editModal.show();
  }
}
