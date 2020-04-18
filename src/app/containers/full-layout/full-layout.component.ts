import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
})
export class FullLayoutComponent implements OnInit, AfterViewChecked {
  loading: boolean;
  seed1: number;
  seed2: number;

  constructor(private router: Router) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.router.events.filter(event => event instanceof NavigationStart).subscribe(e => {
      this.loading = true;
      if (!this.seed1) {
        this.seed1 = window.setInterval(() => this.checkloading(this.seed1, ()=>this.clearseed1(this)), 100);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (!this.seed2) {
      this.seed2 = window.setInterval(() => this.checkloading(this.seed2), 100);
    }
  }

  checkloading(seed: number, callback?: () => void) {
    let body = document.getElementsByClassName('card');
    if (body.length > 0 && body[0].hasAttribute('hidden') == false) {
      this.loading = false;
      window.clearInterval(seed);

      if (callback) {
        callback();
      }
    }
  }

  clearseed1(me: any) {
    me.seed1 = 0;
  }
}
