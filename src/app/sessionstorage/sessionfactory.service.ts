declare const sessionStorage, localStorage;
import { SessionDriver } from './sessiondriver';
import { MemoryStorage } from './memorystorage';
import { CookieStorage } from './cookiestorage';

export const DRIVERS = {
  LOCAL: new SessionDriver(localStorage),
  SESSION: new SessionDriver(sessionStorage),
  MEMORY: new SessionDriver(new MemoryStorage()),
  COOKIE: new SessionDriver(new CookieStorage())
}

export abstract class AbstractSessionConfig {
  public driverNamespace: string
  public defaultDriverType: SessionDriver
}

export class SessionConfig {
  constructor(
    public driverNamespace: string = '',
    public defaultDriverType: SessionDriver = DRIVERS.SESSION
  ) { }
}

export class SessionFactory {
  public static DRIVERS = DRIVERS;

  private driver: SessionDriver;
  private namespace: string;

  constructor({ driverNamespace, defaultDriverType }: SessionConfig) {
    this.setNamespace(driverNamespace);

    if (defaultDriverType.isSupported())
      this.driver = defaultDriverType;

    else if (DRIVERS.COOKIE.isSupported())
      this.driver = DRIVERS.COOKIE;

    else
      this.driver = DRIVERS.MEMORY;
  }

  public setNamespace(namespace = '') {
    this.namespace = namespace;
  }

  public useDriver(driver: SessionDriver) {
    return new SessionFactory({
      defaultDriverType: driver.isSupported() ? driver : DRIVERS.MEMORY,
      driverNamespace: this.namespace
    })
  }

  public set(key, data, expiry?) {
    if (expiry)
      console.warn('Expiry is not implimented yet');

    this.driver.set(this._makeKey(key), data);
  }

  public get(key) {
    return this.driver.get(this._makeKey(key));
  }

  public has(key) {
    return this.driver.has(this._makeKey(key));
  }

  public remove(key) {
    this.driver.remove(this._makeKey(key));
  }

  public key(index?) {
    return this.driver.key(index);
  }

  public clear() {
    this.driver.clear();
  }

  private _makeKey(key: string): string {
    return this.namespace ? `${this.namespace}:${key}` : key;
  }
}
