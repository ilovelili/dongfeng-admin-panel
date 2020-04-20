import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ConstClient } from '../clients';
import { Constant } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConstService extends BaseService {
  constructor(private constClient: ConstClient) {
    super();
  }

  getConsts() {
    const constSession = this.sessionFactory.get(Constant.SESSION_KEY_CONST);
    if (!constSession) {
      this.constClient.getConsts().subscribe(
        (c: Constant) => {
          this.sessionFactory.set(Constant.SESSION_KEY_CONST, {
            notifications: c.notifications,
            roles: c.roles,
            holidays: c.holidays,
            masters: c.masters,
            menus: c.menus,
          });
        });
    }
  }
}