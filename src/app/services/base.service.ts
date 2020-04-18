import { Constant } from '../models';
import { SessionFactory, SessionConfig } from 'app/sessionstorage/sessionfactory.service';

export abstract class BaseService {
  protected sessionFactory: SessionFactory

  constructor() {
    this.sessionFactory = new SessionFactory(new SessionConfig(Constant.SESSION_NAMESPACE, SessionFactory.DRIVERS.LOCAL));
  }

  getSession(key: string): any {
    return this.sessionFactory.get(key);
  }

  setSession(key: string, value: any) {
    this.sessionFactory.set(key, value);
  }

  clearSession(key: string) {
    this.sessionFactory.remove(key);
  }
}