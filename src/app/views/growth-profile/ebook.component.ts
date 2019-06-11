import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { ProfileClient } from 'app/clients';
import { Ebook, Ebooks } from 'app/models';

@Component({
  templateUrl: './ebook.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './ebook.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EBookComponent extends ViewComponent implements OnInit {
  private ebooks: Ebook[];

  constructor(private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.getprofiles();
  }

  getprofiles() {
    this.loading = true;
    this.profileClient.getEbooks(this.currentYear, this.currentClass, this.currentName, this.currentDate).
      subscribe(
        d => {
          if (this.currentYear) {
            this.years.push(this.currentYear);
          }
          if (this.currentClass) {
            this.classes.push(this.currentClass);
          }          

          this.loading = false;
          let e = new Ebooks(d.ebooks);
          if (!e.empty()) {
            this.ebooks = e.ebooks;

            this.ebooks.forEach(e => {
              if (!this.years.includes(e.year)) {
                this.years.push(e.year);
              }
              if (!this.classes.includes(e.class)) {
                this.classes.push(e.class);
              }
            });
          } else {
            this.LogWarning('没有电子书数据');
          }
        },
        e => {
          this.LogError(e, '获取电子书数据失败，请重试');
          this.loading = false;
        },
        () => this.LogComplete('ebook component ebook loading completed')
      );
  }

  get names() {
    let result = [];
    
    this.items.filter(i => {
      let filterres = true;
      if (this.currentYear) {
        filterres = filterres && i.year == this.currentYear;
      }
      if (this.currentClass) {
        filterres = filterres && i.class == this.currentClass;
      }
      return filterres;
    }).map(i => i.name).forEach(n => {
      if (n && !result.includes(n)) {
        result.push(n);
      }
    });

    return result;
  }
}
