export class Physiques {
    constructor(public physiques: Physique[]){}
  
    empty(): boolean {      
      return !this || !this.physiques || !this.physiques.length;
    }
  }
  
  export class Physique {
    id: number;
    year: string;
    class: string;  
    name: string;
    gender: string;
    birth_date: string;
    exam_date: string;
    height: number;
    weight: number;
    age: string;
    age_cmp: number;
    height_p: string;
    weight_p: string;
    height_weight_p: string;
    bmi: number;
    fat_cofficient: number;
    conclusion: string;
  }