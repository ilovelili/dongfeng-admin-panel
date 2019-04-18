export class Classes {
  constructor(public classes: Class[]) {}

  empty(): boolean {
    return !this || !this.classes || this.classes.length == 0;
  }
}

export class Class {
  id: number;
  name: string;
}
