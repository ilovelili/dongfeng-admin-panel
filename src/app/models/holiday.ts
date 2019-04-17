export class Holidays {
  constructor(public holidays: Holiday[]) { }
  empty(): boolean {
    return !this || !this.holidays || this.holidays.length == 0;
  }
}

export class Holiday {
  date: string;
  type: number;
}