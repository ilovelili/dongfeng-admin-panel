import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { MealClient } from 'app/clients';
import { DateRange, Menu } from 'app/models';
import { BsLocaleService } from 'ngx-bootstrap';
import { AuthService } from 'app/services/auth.service';

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
  private menus: Menu[];

  private breakfast_or_lunch: number = 0;
  private junior_or_senior: number = 0;

  constructor(private mealClient: MealClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService, protected localeService: BsLocaleService) {
    super(router, authService, activatedRoute, toasterService, localeService);
    // overwrite datefrom / dateto
    this.dateFrom = this.dateToString(this.monday())
    this.dateTo = this.dateToString(this.friday())
    this.dateRange = new DateRange(this.dateFrom, this.dateTo).format();
  }

  ngOnInit(): void {
    this.getmenus();
  }

  protected set_breakfast_or_lunch(breakfast_or_lunch: number) {
    if (this.breakfast_or_lunch != breakfast_or_lunch) {
      this.breakfast_or_lunch = breakfast_or_lunch;
    };
  }

  protected set_junior_or_senior(junior_or_senior: number) {
    if (this.junior_or_senior != junior_or_senior) {
      this.junior_or_senior = junior_or_senior;
    };
  }

  getmenus() {
    this.loading = true;
    this.dateFrom = this.dateToString(this.dateRange[0]);
    this.dateTo = this.dateToString(this.dateRange[1]);

    this.mealClient.getMenus(this.junior_or_senior, this.breakfast_or_lunch, this.dateFrom, this.dateTo).
      subscribe(
        d => {
          this.loading = false;
          this.conditionModal.hide();
          this.menus = d;
          this.items = this.menus.map((m: Menu) => new Menu(
            m.id,
            m.date,
            m.recipe,
            m.breakfast_or_lunch,
            m.junior_or_senior
          ));
        },
        e => this.LogError(e, '获取食谱信息失败，请重试'),
        () => this.LogComplete('menu component menus loading completed')
      );
  }
}
