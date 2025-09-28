import type { Category, CategoriesRepository } from "../categories_repository.ts";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Sports" },
    { id: 3, name: "Politics" },
    { id: 4, name: "Entertainment" },
    { id: 5, name: "Science" }
  ];

  async findAll(): Promise<Category[]> {
    return [...this.categories];
  }

  async findById(id: number): Promise<Category | null> {
    const category = this.categories.find(cat => cat.id === id);
    return category || null;
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return this.categories.filter(cat => ids.includes(cat.id));
  }
}