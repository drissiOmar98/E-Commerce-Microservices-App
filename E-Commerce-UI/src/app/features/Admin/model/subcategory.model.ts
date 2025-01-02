export interface NewSubCategory {
  name: string;
  categoryId: number;
}

export interface CreatedSubCategory {
  id: number;
}


export interface SubCategoryResponse {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
}
