import { NewsRepository, SearchNewsParams } from "#src/repositories/news_repository.ts";
import { News } from "../entities/news_entity";

interface SearchNewsUseCaseParams {
  page: number;
  limit: number;
  period?: 'day' | 'week' | 'month';
  category?: string;
}

interface SearchNewsUseCaseResult {
  news: News[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class SearchNewsUseCase {
  constructor(private newsRepository: NewsRepository) {}

  async execute(params: SearchNewsUseCaseParams): Promise<SearchNewsUseCaseResult> {
    const { page, limit, period, category } = params;

    const searchParams: SearchNewsParams = {
      page,
      limit,
      period,
      category
    };

    const result = await this.newsRepository.findMany(searchParams);

    // Calcular informações de paginação
    const totalPages = Math.ceil(result.totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      news: result.news,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: result.totalCount,
        limit,
        hasNextPage,
        hasPreviousPage
      },
    };
  }
}
