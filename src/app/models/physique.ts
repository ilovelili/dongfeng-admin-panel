export class Physiques {
  constructor(public physiques: Physique[]) { }

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

export class Physique_AgeHeightWeightPMasters {
  constructor(public masters: Physique_AgeHeightWeightPMaster[]) { }

  empty(): boolean {
    return !this || !this.masters || !this.masters.length;
  }
}

export class Physique_AgeHeightWeightPMaster {
  constructor(
    public id: number,
    public height_or_weight: string,
    public gender: string,
    public age_min: number,
    public age_max: number,
    public p3: number,
    public p10: number,
    public p20: number,
    public p50: number,
    public p80: number,
    public p97: number) { }

  get age_range(): string {
    return `${this.age_min}岁-${this.age_max}岁`;
  }

  get hw(): string {
    if (this.height_or_weight == 'w') {
      return "体重";
    } else if (this.height_or_weight == 'h') {
      return "身高";
    }

    return "NA"
  }
}

export class Physique_AgeHeightWeightSDMasters {
  constructor(public masters: Physique_AgeHeightWeightSDMaster[]) { }

  empty(): boolean {
    return !this || !this.masters || !this.masters.length;
  }
}

export class Physique_AgeHeightWeightSDMaster {
  constructor(
    public id: number,
    public height_or_weight: string,
    public gender: string,
    public age: string,
    public sdm2: number,
    public sdm1: number,
    public avg: number,
    public sd1: number,
    public sd2: number) { }

    get hw(): string {
      if (this.height_or_weight == 'w') {
        return "体重";
      } else if (this.height_or_weight == 'h') {
        return "身高";
      }
  
      return "NA"
    }
}

export class Physique_BMIMasters {
  constructor(public masters: Physique_BMIMaster[]) { }

  empty(): boolean {
    return !this || !this.masters || !this.masters.length;
  }
}

export class Physique_BMIMaster {
  constructor(
    public id: number,
    public gender: string,
    public age: string,
    public avg: number,
    public sd1: number,
    public sd2: number,
    public sd3: number) { }
}

export class Physique_HeightToWeightPMasters {
  constructor(public masters: Physique_HeightToWeightPMaster[]) { }

  empty(): boolean {
    return !this || !this.masters || !this.masters.length;
  }
}

export class Physique_HeightToWeightPMaster {
  constructor(
    public id: number,
    public gender: string,
    public height: number,
    public p3: number,
    public p10: number,
    public p20: number,
    public p50: number,
    public p80: number,
    public p97: number) { }
}

export class Physique_HeightToWeightSDMasters {
  constructor(public masters: Physique_HeightToWeightSDMaster[]) { }

  empty(): boolean {
    return !this || !this.masters || !this.masters.length;
  }
}

export class Physique_HeightToWeightSDMaster {
  constructor(
    public id: number,
    public gender: string,
    public height: number,
    public sdm3: number,
    public sdm2: number,
    public sdm1: number,
    public sd0: number,
    public sd1: number,
    public sd2: number,
    public sd3: number) { }
}
