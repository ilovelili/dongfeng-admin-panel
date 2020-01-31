import { SessionFactory, SessionConfig } from "app/sessionstorage/sessionfactory.service";

export class Constant {
    errors: Object;
    notifications: Object;
    roles: Object;
    holidays: Object;
    masters: Object;

    static get Instance(): Constant {
        let key_const: string = 'consts';
        let namespace: string = 'dongfeng';
        let sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(namespace, SessionFactory.DRIVERS.LOCAL));
        return sessionFactory.get(key_const);
    }
}