export interface Category {
  id: number;
  name: string;
  hexColor: string;
}


export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryRequest {
  name: string;
  hexColor: string;
}
