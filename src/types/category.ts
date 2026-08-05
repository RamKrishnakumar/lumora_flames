export interface SubCategory {
    id: string;
    name: string;
    description: string;
    examples: string[];
}

export interface Category {
    id: string;
    title: string;
    tagline: string;
    description: string;
    subCategories: SubCategory[];
    heroImage: string;
}