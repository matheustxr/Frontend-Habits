export interface Category {
  id: number;
  category: string;
  hexColor: string;
}


export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryRequest {
  category: string;
  hexColor: string;
}
