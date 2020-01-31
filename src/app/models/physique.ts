import { Pupil } from ".";

export class Physique {
  constructor(
    public id: number,
    public pupil: Pupil,
    public pupil_id: number,
    public gender: string,
    public birth_date: string,
    public exam_date: string,
    public height: number,
    public weight: number,
    public age: string,
    public age_cmp: number,
    public height_p: string,
    public weight_p: string,
    public height_weight_p: string,
    public bmi: number,
    public fat_cofficient: number,
    public conclusion: string
  ) { }

  get name(): string {
    return this.pupil.name;
  }

  get className(): string {
    return this.pupil.class.name;
  }

  get classId(): number {
    return this.pupil.class.id;
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
