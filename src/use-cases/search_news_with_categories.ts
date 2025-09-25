import { NewsRepository, SearchNewsParams } from "#repositories/news_repository.ts";

interface SearchNewsUseCaseParams {
  page: number;
  limit: number;
  period?: 'day' | 'week' | 'month';
  category?: string;
}

interface NewsWithCategories {
  id: number;
  title: string;
  summary: string | null;
  source: string | null;
  content: string;
  publishedAt: Date;
  categories: {
    id: number;
    name: string;
  }[];
}

interface SearchNewsUseCaseResult {
  news: NewsWithCategories[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    period: string | null;
    category: string | null;
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

    const result = await this.newsRepository.searchNews(searchParams);

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
      filters: {
        period: period || null,
        category: category || null
      }
    };
  }
}
