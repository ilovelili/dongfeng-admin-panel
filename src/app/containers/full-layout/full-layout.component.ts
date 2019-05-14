import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',  
})
export class FullLayoutComponent implements OnInit, AfterViewChecked {    
  private loading: boolean;
  private seed: number;

  constructor(private router: Router) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.router.events.filter(event => event instanceof NavigationStart).subscribe(e => {      
      this.loading = true;
      if (!this.seed) {
        this.seed = window.setInterval(() => this.checkloading(), 100);
      }
    });
  }  

  ngAfterViewChecked(): void {
    if (!this.seed) {
      this.seed = window.setInterval(() => this.checkloading(), 100);
    }
  }

  checkloading() {
    let body = document.getElementsByClassName('card');
    if (body.length > 0 && body[0].hasAttribute('hidden') == false) {
      this.loading = false;
      window.clearInterval(this.seed);
      this.seed = 0;
    }
  }
}
