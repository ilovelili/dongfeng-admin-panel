import { Constant } from "./const";
import { Class } from './class';
import { User } from "./user";

export class Teacher {
  id: number;
  name: string;
  email?: string;
  class?: Class;
  user?: User;

  get className(): string {
    return this.class ? this.class.name : "-";
  }
  
  get role(): string {
    return this.user ? Constant.Instance.roles[this.user.role] : "未设定";
  }
}