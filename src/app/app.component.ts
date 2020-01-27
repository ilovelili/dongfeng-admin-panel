import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConstClient } from './clients';
import { SessionFactory, SessionConfig } from './sessionstorage/sessionfactory.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  private key_const = "consts"
  private namespace: string = 'dongfeng';
  private sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));

  constructor(private router: Router, private constClient: ConstClient) { }

  ngOnInit() {
    this.constClient.getConsts().subscribe(
      d => this.sessionFactory.set(this.key_const, d),
      e => console.error(e)
    )

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
}
