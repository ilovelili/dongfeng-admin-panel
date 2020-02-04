import { Ingredient } from "./ingredient";

export class Recipe {
    constructor(
        public name: string,
        public ingredients: Ingredient[],
        public carbohydrate: number,
        public dietaryfiber: number,
        public protein: number,
        public fat: number,
        public heat: number,
    ) { }

    get ingredientNames(): string[] {
        return this.ingredients.map(i => i.ingredient);
    }
}