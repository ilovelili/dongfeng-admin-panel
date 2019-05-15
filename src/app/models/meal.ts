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
      if (r1.date > r2.date) return 1;
      if (r1.date < r2.date) return -1;

      if (r1.date == r2.date) {
        if (r1.breakfast_or_lunch > r2.breakfast_or_lunch) return 1;
        if (r1.breakfast_or_lunch < r2.breakfast_or_lunch) return -1;

        if (r1.breakfast_or_lunch == r2.breakfast_or_lunch) {
          if (r1.junior_or_senior > r2.junior_or_senior) return 1;
          if (r1.junior_or_senior < r2.junior_or_senior) return -1;
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

export class Recipes {
  constructor(public recipes: Recipe[]) { }

  empty(): boolean {
    return !this || !this.recipes || !this.recipes.length;
  }

  format_recipe(): FormattedRecipe[] {
    let result: FormattedRecipe[] = [];
    if (this.empty()) {
      return result;
    }

    this.recipes.forEach(r => {
      if (r.ingredients && r.ingredients.length) {
        r.ingredients.forEach(i => {
          // join all ingredient names
          let ingredients = r.ingredients.map(i => i.ingredient).join(",");

          let found = false;
          result.forEach(re => {
            if (re.recipe == r.recipe) {
              found = true;
              return;
            }
          });

          if (!found) {
            result.push(new FormattedRecipe(
              r.recipe,
              r.carbohydrate,
              r.dietaryfiber,
              r.protein,
              r.fat,
              r.heat,
              ingredients)
            );
          }
        });
      }
    })

    return result;
  }

  format_ingredient(): FormattedIngredient[] {
    let result: FormattedIngredient[] = [];
    if (this.empty()) {
      return result;
    }

    let recipemap = new Map<string, string[]>();
    for (let r of this.recipes) {
      for (let ingredient of r.ingredients) {
        let key = ingredient.ingredient;
        // map.has seems to be buggy?        
        if (recipemap[key]) {
          recipemap[key].push(r.recipe);
        } else {
          recipemap[key] = [r.recipe];
        }
      }
    }

    this.recipes.forEach(r => {
      if (r.ingredients && r.ingredients.length) {
        r.ingredients.forEach(i => {
          let formattedingredient = new FormattedIngredient(
            i.ingredient,
            i.protein_100g,
            i.protein_daily,
            i.fat_100g,
            i.fat_daily,
            i.carbohydrate_100g,
            i.carbohydrate_daily,
            i.heat_100g,
            i.heat_daily,
            i.calcium_100g,
            i.calcium_daily,
            i.iron_100g,
            i.iron_daily,
            i.zinc_100g,
            i.zinc_daily,
            i.va_100g,
            i.va_daily,
            i.vb1_100g,
            i.vb1_daily,
            i.vb2_100g,
            i.vb2_daily,
            i.vc_100g,
            i.vc_daily,
            i.category,
            recipemap[i.ingredient].join(","));

          let found = false;
          result.forEach(r => {
            if (r.ingredient == i.ingredient) {
              found = true;
              return;
            }
          });

          if (!found) {
            result.push(formattedingredient);
          }
        });
      }
    })

    return result;
  }
}

export class Recipe {
  constructor(
    public recipe: string,
    public ingredients: Ingredient[],
    public carbohydrate: number,
    public dietaryfiber: number,
    public protein: number,
    public fat: number,
    public heat: number,
  ) { }
}

export class FormattedRecipe {
  constructor(
    public recipe: string,
    public carbohydrate: number,
    public dietaryfiber: number,
    public protein: number,
    public fat: number,
    public heat: number,
    public ingredients: string,
  ) { }
}

export class FormattedIngredient {
  constructor(
    public ingredient: string,
    public protein_100g: number,
    public protein_daily: number,
    public fat_100g: number,
    public fat_daily: number,
    public carbohydrate_100g: number,
    public carbohydrate_daily: number,
    public heat_100g: number,
    public heat_daily: number,
    public calcium_100g: number,
    public calcium_daily: number,
    public iron_100g: number,
    public iron_daily: number,
    public zinc_100g: number,
    public zinc_daily: number,
    public va_100g: number,
    public va_daily: number,
    public vb1_100g: number,
    public vb1_daily: number,
    public vb2_100g: number,
    public vb2_daily: number,
    public vc_100g: number,
    public vc_daily: number,
    public category: string,
    public recipes: string,
  ) { }
}

export class Ingredients {
  constructor(public ingredients: Ingredient[]) { }

  empty(): boolean {
    return !this || !this.ingredients || !this.ingredients.length;
  }
}

export class Ingredient {
  constructor(
    public ingredient: string,
    public category: string,
    public alias: string,
    public protein_100g: number,
    public protein_daily: number,
    public fat_100g: number,
    public fat_daily: number,
    public carbohydrate_100g: number,
    public carbohydrate_daily: number,
    public heat_100g: number,
    public heat_daily: number,
    public calcium_100g: number,
    public calcium_daily: number,
    public iron_100g: number,
    public iron_daily: number,
    public zinc_100g: number,
    public zinc_daily: number,
    public va_100g: number,
    public va_daily: number,
    public vb1_100g: number,
    public vb1_daily: number,
    public vb2_100g: number,
    public vb2_daily: number,
    public vc_100g: number,
    public vc_daily: number,
  ) { }
}
