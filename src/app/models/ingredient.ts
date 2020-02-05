import { Recipe } from "./recipe";

export class Ingredient {
    constructor(
      public id: number,
      public ingredient: string,
      public category: IngredientCategory,
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
      public recipes: Recipe[],
    ) { }
  
    get categoryName(): string {
      return this.category.category;
    }

    get recipeNames(): string[] {
      return this.recipes.map(r => r.name);
    }

    get recipeIds(): string {
      return this.recipes.map(r => r.id).join(",");
    }
  }
  
  export class IngredientCategory {
    id: number;
    category: string;
  }
  