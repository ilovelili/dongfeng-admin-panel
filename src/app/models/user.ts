export class User {
  id: string;
  email: string;
  name: string;
  photo: string;
  role: number;
}

export class Role {
  static RoleUndefined = 0;
  static RoleAgentSmith = 1;
  static RoleAdmin = 2;
  static RoleNormal = 3;
  static RoleHealth = 4;
}