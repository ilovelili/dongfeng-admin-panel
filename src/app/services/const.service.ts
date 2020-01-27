// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionFactory, SessionConfig } from '../sessionstorage/sessionfactory.service';
import { ConstClient } from 'app/clients';
import { Constant } from 'app/models/const';

@Injectable()
export class ConstService {
  private key_const: string = 'consts';
  private namespace: string = 'dongfeng';
  private sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));

  constructor(private router: Router, private constClient: ConstClient) {
  }

  setConsts() {
    this.constClient.getConsts().subscribe(
      d => this.sessionFactory.set(this.key_const, d),
      e => console.error(e)
    )
  }

  get Consts(): Constant {
    return this.sessionFactory.get(this.key_const);
  }
}