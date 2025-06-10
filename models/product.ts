export class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    requirements: number[];
    image: string;
    category: string;
    quantity: number;
    effect?: string;
    constructor(id: number, name: string, description: string, price: number, requirements: number[], image: string, category: string, quantity: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.requirements = requirements;
        this.image = image;
        this.category = category;
        this.quantity = quantity;
    }
}