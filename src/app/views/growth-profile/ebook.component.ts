import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ToasterService } from 'angular2-toaster';
import { ProfileClient } from 'app/clients';
import { Ebooks, Ebook } from 'app/models';
import { environment } from 'environments/environment';

@Component({
  templateUrl: './ebook.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './ebook.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EBookComponent extends ViewComponent implements OnInit {
  private ebooks: Ebooks;
  private oneyear = true; // show only one year

  @ViewChild('ebookModal') ebookModal

  constructor(private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.ebookModal.hide();
    this.getebooks();
  }

  getebooks() {
    this.loading = true;
    this.profileClient.getEbooks(this.currentYear, this.currentClass, this.currentName).
      subscribe(
        d => {          
          if (this.currentYear) {
            this.years.push(this.currentYear);
          }
          if (this.currentClass) {
            this.classes.push(this.currentClass);
          }

          this.ebooks = new Ebooks(d.ebooks);
          if (!this.ebooks.empty()) {
            this.items = this.ebooks.ebooks;
            this.items.forEach(e => {
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

          this.loading = false;
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

  showebook(ebook: Ebook, oneyear: boolean) {    
    this.oneyear = oneyear;    
    if (oneyear) {
      this.currentYear = ebook.year;      
    }
    
    this.currentName = ebook.name;
    this.currentClass = ebook.class;    

    this.conditionModal.hide();
    this.ebookModal.show();
  }

  get images(): string[] {
    let result = [];
    this.items.filter(i => {
      let filterres = true;
      if (this.currentYear) {
        filterres = filterres && i.year == this.currentYear;
      }
      if (this.currentClass) {
        filterres = filterres && i.class == this.currentClass;
      }
      if (this.currentName) {
        filterres = filterres && i.name == this.currentName;
      }
      return filterres;
    }).map((i): Ebook => {      
      if (!i.dates) {
        return;
      }
        
      i.dates.forEach(d => {
        if (this.oneyear) {
          if (this.currentYear) {
            result.push({
              url: `${environment.api.imageServer}/${this.currentYear}/${this.currentClass}/${this.currentName}/${d}.jpg`,
              date: d,
            });
          }          
        } else {
          this.years.forEach(y => {
            result.push({
              url: `${environment.api.imageServer}/${y}/${this.currentClass}/${this.currentName}/${d}.jpg`,
              date: d,
            });
          });
        }
      });

      return;
    });

    return result.sort((r1, r2) => {
      let d = new Date(r1.date).getTime() - new Date(r2.date).getTime();
      if (d > 0) return 1;
      if (d < 0) return -1;
      return 0;
    }).map(r => r.url);
  }
}
