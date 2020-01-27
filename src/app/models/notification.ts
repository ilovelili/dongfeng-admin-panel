import { Constant } from "./const";
import { SessionFactory, SessionConfig } from "app/sessionstorage/sessionfactory.service";

export class Notification {
  constructor(
    public id: number,
    public user: string,
    public custom_code: string,
    public category: string,
    public details: string,
    public link: string,
    public created_at: string,
    public read: boolean = false) { }

  get constant(): Constant {
    let key_const: string = 'consts';
    let namespace: string = 'dongfeng';
    let sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(namespace, SessionFactory.DRIVERS.LOCAL));
    return sessionFactory.get(key_const);
  }

  // parse details by customcode and detail info
  get Detail(): string {
    for (let key in this.constant.notifications) {
      if (key == this.custom_code) {
        return this.constant.notifications[key].replace(/{{time}}/g, this.formatDate(this.created_at));
      }
    }

    return "";
  }

  get Link(): string {
    return this.link || "#";
  }

  get Title(): string {
    let title = this.category;
    if (this.custom_code != "N5001") {
      return title;
    }

    JSON.parse(this.details, (key, value) => {
      if (key == "title") {
        title = value;
      }
    });
    return title;
  }

  get Content(): string {
    let content = this.Detail;
    if (this.custom_code != "N5001") {
      return content;
    }

    JSON.parse(this.details, (key, value) => {
      if (key == "content") {
        content = `${this.formatDate(this.created_at)} ${value}`;
      }
    });
    return content;
  }

  private formatDate(date: string, exacttime = true) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = d.getHours(),
      minute = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if (!exacttime) {
      return [year, month, day].join('-');
    }
    return [year, month, day].join('-') + ' ' + [hour, minute].join(':');
  }
}