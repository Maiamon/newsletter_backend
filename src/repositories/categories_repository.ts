export interface Category {
  id: number;
  name: string;
}

export interface CategoriesRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findByIds(ids: number[]): Promise<Category[]>;
}