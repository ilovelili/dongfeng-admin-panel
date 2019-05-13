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

    result.sort((r1, r2): number => {
      if (r1.date > r2.date) {
        return 1;
      }

      if (r1.date < r2.date) {
        return -1;
      }

      if (r1.date == r2.date) {
        if (r1.breakfast_or_lunch > r2.breakfast_or_lunch) {
          return 1;
        }

        if (r1.breakfast_or_lunch < r2.breakfast_or_lunch) {
          return -1;
        }

        if (r1.breakfast_or_lunch == r2.breakfast_or_lunch) {
          if (r1.junior_or_senior > r2.junior_or_senior) {
            return 1;
          }

          if (r1.junior_or_senior < r2.junior_or_senior) {
            return -1;
          }

          return 0;
        }
      }
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