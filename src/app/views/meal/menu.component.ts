import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { Menus } from 'app/models/meal';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients/meal.client';
import { DateRange } from 'app/models';
import { BsLocaleService } from 'ngx-bootstrap';

@Component({
  templateUrl: './menu.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    '../../../scss/vendors/bs-datepicker/bs-datepicker.scss',
    './menu.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent extends ViewComponent implements OnInit {
  private menus: Menus;
  private meal: string = '全部';

  constructor(private mealClient: MealClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService, protected localeService: BsLocaleService) {
    super(router, activatedRoute, toasterService, localeService);
    // overwrite datefrom / dateto
    this.dateFrom = this.formatDate(this.monday())
    this.dateTo = this.formatDate(this.friday())
    this.dateRange = new DateRange(this.dateFrom, this.dateTo).format();
  }

  ngOnInit(): void {
    this.getmenus();
  }

  protected setmeal(meal: string) {
    if (meal != this.meal) {
      this.meal = meal;
    };
  }

  getmenus() {
    this.loading = true;
    this.dateFrom = this.formatDate(this.dateRange[0]);
    this.dateTo = this.formatDate(this.dateRange[1]);

    this.mealClient.getMenus(this.currentClass, this.meal, this.dateFrom, this.dateTo).
      subscribe(
        d => {
          this.loading = false;
          this.menus = new Menus(d.menus).format();
          this.items = this.menus.menus;
        },
        e => this.LogError(e, '获取食谱信息失败，请重试'),
        () => this.LogComplete('menu component menus loading completed')
      );
  }  
}
