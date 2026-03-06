export interface ProductSpec {
    key: string;
    value: string;
}

export interface ProductVariation {
    name: string;
    options: string[];
}

export interface ProductAdditionalInfo {
    warranty: string;
    production?: string;
    shipping?: string;
    care?: string;
}

export interface ProductDimensions {
    product: string;
    weight: string;
    packaged: string;
}

export interface Product {
    _id?: string;
    code: string;
    name: string;
    label: "Kayu" | "Besi" | "Mixed";
    category: string;
    collection: string;
    price: number;
    memberPrice: number;
    stock: number;
    status: "In Stock" | "Low Stock" | "Out of Stock" | "Pre-order";
    rating?: number;
    media: string[];
    mainMediaIndex: number;
    delivery: string;
    description: string;
    specifications: ProductSpec[];
    variations?: ProductVariation[];
    dimensions: ProductDimensions;
    fabric: string;
    returns?: string;
    additionalInfo: ProductAdditionalInfo;
}

export interface Article {
    _id?: string;
    id?: number; // Keep for legacy if needed
    title: string;
    description: string;
    image: string;
    category: string;
    author: string;
    date: string;
    featured?: boolean;
    content?: string;
    tags?: string[];
}
