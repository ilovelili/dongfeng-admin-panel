import { Constant } from "./const";

export class User {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public photo: string,
    public role: number,
  ) { }

  get roleName(): string {
    return Constant.Instance.roles[this.role];
  }
}

export class Role {
  static RoleUndefined = 0;
  static RoleAgentSmith = 1;
  static RoleAdmin = 2;
  static RoleNormal = 3;
  static RoleHealth = 4;

  static AllRoles = [Role.RoleAdmin, Role.RoleNormal, Role.RoleHealth];
}