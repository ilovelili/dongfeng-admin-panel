export class ProfileTemplates {
  constructor(public profiletemplates: ProfileTemplate[]) { }
  empty(): boolean {
    return !this || !this.profiletemplates || !this.profiletemplates.length;
  }
}

export class ProfileTemplate {
  id: number;
  name: string;
  created_by: string;
}