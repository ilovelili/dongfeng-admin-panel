export class Teachers {
  constructor(public teachers: Teacher[]) { }
  empty(): boolean {
    return !this || !this.teachers || !this.teachers.length;
  }
}

export class Teacher {
  id: number;
  year: string;
  name: string;
  class: string;
  email: string;
  role: string;
}