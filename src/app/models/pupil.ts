import { Class } from ".";

export class Pupil {
  id: number;
  name: string;
  class: Class;

  get className(): string {
    return this.class.name
  }

  get classId(): number {
    return this.class.id;
  }  
}