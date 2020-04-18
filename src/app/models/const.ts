import { SessionFactory, SessionConfig } from "app/sessionstorage/sessionfactory.service";

export class Constant {
    notifications: Object;
    roles: Object;
    holidays: Object;
    masters: Object;
    menus: {
        breakfast_or_lunch: Object;
        junior_or_senior: Object;
    };

    static SESSION_NAMESPACE: string = 'dongfeng';
    static SESSION_KEY_IDTOKEN: string = 'token';
    static SESSION_KEY_YEAR: string = 'year';
    static SESSION_KEY_CONST: string = 'consts';

    static Instance(retryCount = 0): Constant {
        // add retry
        if (retryCount > 10) return null;
        let sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(Constant.SESSION_NAMESPACE, SessionFactory.DRIVERS.LOCAL));
        let constant = sessionFactory.get(Constant.SESSION_KEY_CONST);
        if (!constant) {
            window.setTimeout(() => Constant.Instance(retryCount++), 500);
            return;
        }
        
        return constant;
    }
}