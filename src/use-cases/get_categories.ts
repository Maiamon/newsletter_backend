import { NewsRepository, Category } from "#src/repositories/news_repository.ts";

interface GetCategoriesUseCaseResult {
  categories: Category[];
  totalCount: number;
}

export class GetCategoriesUseCase {
  constructor(private newsRepository: NewsRepository) {}

  async execute(): Promise<GetCategoriesUseCaseResult> {
    const categories = await this.newsRepository.findAllCategories();

    return {
      categories,
      totalCount: categories.length
    };
  }
}