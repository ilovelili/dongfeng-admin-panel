import { Ingredient } from "./ingredient";

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
            i.category.category,
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

export class Procurements {
  constructor(public procurements: Procurement[]) { }

  empty(): boolean {
    return !this || !this.procurements || !this.procurements.length;
  }

  format(): FormattedProcurement[] {
    let result: FormattedProcurement[] = [];
    if (this.empty()) {
      return result;
    }

    this.procurements.forEach(p => {
      p.procurements.forEach(i => {
        result.push(new FormattedProcurement(p.date, p.attendance, i.id, i.recipe, i.ingredient, i.amount));
      });
    });

    return result;
  }
}

export class Procurement {
  constructor(
    public date: string,
    public attendance: number,
    public procurements: ProcurementItem[],
  ) { }
}

export class ProcurementItem {
  constructor(
    public id: number,
    public recipe: string,
    public ingredient: string,
    public amount: number,
  ) { }
}

export class FormattedProcurement {
  constructor(
    public date: string,
    public attendance: number,
    public id: number,
    public recipe: string,
    public ingredient: string,
    public amount: number,
  ) { this.total = Math.round(this.attendance * this.amount); }

  public total: number;
}