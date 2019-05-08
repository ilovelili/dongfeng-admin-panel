export class Menus {
  constructor(public menus: Menu[]) { }

  empty(): boolean {
    return !this || !this.menus || !this.menus.length;
  }

  format(): Menus {
    let result: Menu[] = [];
    if (this.empty()) {
      return this;
    }

    this.menus.forEach(m => {
      m.breakfast_or_lunch_str = this.resolveBreakfastOrLunch(m.breakfast_or_lunch);
      m.junior_or_senior_str = this.resolveJuniorOrSenior(m.junior_or_senior);
      result.push(m);
    })

    return new Menus(result);
  }

  private resolveBreakfastOrLunch(breakfast_or_lunch: number): string {
    if (breakfast_or_lunch == 0) {
        return "早餐"
    }
    if (breakfast_or_lunch == 1) {
        return "午餐"
    }
    if (breakfast_or_lunch == 2) {
        return "早点"
    }    
    return "";
  }

  private resolveJuniorOrSenior(junior_or_senior: number): string {
    if (junior_or_senior == 0) {
        return "小班"
    }
    if (junior_or_senior == 1) {
        return "中班/大班"
    }

    return "";
  }
}

export class Menu {
  constructor(
    public id: number,
    public date: string,
    public recipe: string,
    public breakfast_or_lunch: number,
    public junior_or_senior: number) { }

  breakfast_or_lunch_str: string;
  junior_or_senior_str: string;
}