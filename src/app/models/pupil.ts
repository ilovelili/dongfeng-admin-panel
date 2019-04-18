export class Pupils {
  constructor(public pupils: Pupil[]){}

  empty(): boolean {
    return !this || !this.pupils || this.pupils.length == 0;
  }  
}

export class Pupil {
  id: number;
  year: string;
  class: string;  
  name: string;
}