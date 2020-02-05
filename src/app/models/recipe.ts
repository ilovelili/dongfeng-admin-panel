import { Ingredient } from "./ingredient";

export class Recipe {
    constructor(
        public id: number,
        public name: string,
        public ingredients: Ingredient[],
        public nutrition?: RecipeNutrition,
    ) { }

    get ingredientIds(): string {
        return this.ingredients.map(i => i.id.toString()).join(",");
    }

    get ingredientNames(): string {
        return this.ingredients.map(i => i.ingredient).join(",");
    }

    static toIngredients(recipes: Recipe[]): Ingredient[] {
        let ingredients = [];
        recipes.forEach(r => {
            r.ingredients.forEach(i => {
                i.recipes = [r];
                ingredients.push(i);
            });
        });

        let ingredientMaps: Map<string, Ingredient> = new Map();
        ingredients.forEach((i: Ingredient) => {
            if (ingredientMaps.has(i.ingredient)) {
                i.recipes = ingredientMaps.get(i.ingredient).recipes.concat(i.recipes);
            }
            ingredientMaps.set(i.ingredient, i);
        });

        return Array.from(ingredientMaps.values()).map(i => new Ingredient(
            i.id,
            i.ingredient,
            i.category,
            i.alias,
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
            i.recipes
        )).sort((i1, i2): number => {
            if (i1.id > i2.id) return 1;
            if (i1.id < i2.id) return -1;            
            return 0;
        });;
    }
}

export class RecipeNutrition {
    constructor(
        public carbohydrate: number,
        public dietaryfiber: number,
        public protein: number,
        public fat: number,
        public heat: number,
    ) { }
}