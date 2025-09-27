import { News } from "../entities/news_entity";
import { NewsRepository } from "../repositories/news_repository";

interface GetNewsDetailUseCaseProps {
  id: number;
}

export class GetNewsDetailUseCase {
  constructor(private newsRepository: NewsRepository) {}

  async execute({
    id
  }: GetNewsDetailUseCaseProps): Promise<News | null> {
    const news = await this.newsRepository.findById(id);

    if (!news) {
      return null;
    }

    return news
  }
}