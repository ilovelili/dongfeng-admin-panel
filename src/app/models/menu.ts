import { Constant } from "./const";
import { Recipe } from "./recipe";

export class Menu {
    constructor(
        public id: number,
        public date: string,
        public recipe: Recipe,
        public breakfast_or_lunch: number,
        public junior_or_senior: number) { }

    get recipeName(): string {
        return this.recipe.name;
    }

    get breakfast_or_lunch_str(): string {
        let result = Constant.Instance.menus.breakfast_or_lunch[this.breakfast_or_lunch];
        return result || "";
    }

    get junior_or_senior_str(): string {
        let result = Constant.Instance.menus.junior_or_senior[this.junior_or_senior];
        return result || "";
    }

    static sort(menus: Menu[]): Menu[] {
        return menus.sort((m1, m2): number => {
            if (m1.date > m2.date) return 1;
            if (m1.date < m2.date) return -1;            

            if (m1.junior_or_senior > m2.junior_or_senior) return 1;
            if (m1.junior_or_senior < m2.junior_or_senior) return -1;

            if (m1.breakfast_or_lunch > m2.breakfast_or_lunch) return 1;
            if (m1.breakfast_or_lunch < m2.breakfast_or_lunch) return -1;
            
            return 0;
        });
    }
}
