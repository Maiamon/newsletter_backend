import { CategoriesRepository, Category } from "#src/repositories/categories_repository.ts";

interface GetCategoriesUseCaseResult {
  categories: Category[];
  totalCount: number;
}

export class GetCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<GetCategoriesUseCaseResult> {
    const categories = await this.categoriesRepository.findAll();

    return {
      categories,
      totalCount: categories.length
    };
  }
}