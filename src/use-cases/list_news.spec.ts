import { describe, expect, it, beforeEach } from 'vitest';
import { SearchNewsUseCase } from './list_news';
import { InMemoryNewsRepository } from '../repositories/in-memory/in-memory-news-repository';

describe('Search News Use Case', () => {
  let newsRepository: InMemoryNewsRepository;
  let searchNewsUseCase: SearchNewsUseCase;

  beforeEach(() => {
    newsRepository = new InMemoryNewsRepository();
    searchNewsUseCase = new SearchNewsUseCase(newsRepository);
  });

  it('should return paginated news results', async () => {
    // Arrange - Criar 5 notícias de teste
    for (let i = 1; i <= 5; i++) {
      await newsRepository.create({
        title: `News ${i}`,
        content: `Content for news ${i}`,
        summary: `Summary ${i}`,
        source: `Source ${i}`,
        publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // i dias atrás
        categories: [{ id: 1, name: 'Technology' }]
      });
    }

    // Act
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 3
    });

    // Assert
    expect(result.news).toHaveLength(3);
    expect(result.pagination.currentPage).toBe(1);
    expect(result.pagination.totalPages).toBe(2);
    expect(result.pagination.totalCount).toBe(5);
    expect(result.pagination.limit).toBe(3);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it('should return news ordered by publication date descending', async () => {
    // Arrange - Criar notícias com datas diferentes
    await newsRepository.create({
      title: 'Older News',
      content: 'Older content',
      publishedAt: new Date('2024-01-01'),
      categories: [{ id: 1, name: 'Technology' }]
    });

    await newsRepository.create({
      title: 'Newer News',
      content: 'Newer content',
      publishedAt: new Date('2024-12-01'),
      categories: [{ id: 1, name: 'Technology' }]
    });

    // Act
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10
    });

    // Assert
    expect(result.news[0].title).toBe('Newer News');
    expect(result.news[1].title).toBe('Older News');
  });

  it('should filter news by category', async () => {
    // Arrange - Criar notícias com diferentes categorias e datas específicas
    await newsRepository.create({
      title: 'Tech News',
      content: 'Tech content',
      publishedAt: new Date('2024-01-01'),
      categories: [{ id: 1, name: 'Technology' }]
    });

    await newsRepository.create({
      title: 'Sports News',
      content: 'Sports content',
      publishedAt: new Date('2024-01-02'),
      categories: [{ id: 2, name: 'Sports' }]
    });

    await newsRepository.create({
      title: 'Mixed News',
      content: 'Mixed content',
      publishedAt: new Date('2024-01-03'), // Mais recente
      categories: [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Sports' }
      ]
    });

    // Act - Filtrar por categoria Technology
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10,
      category: 'Technology'
    });

    // Assert
    expect(result.news).toHaveLength(2);
    expect(result.news[0].title).toBe('Mixed News'); // Mais recente primeiro
    expect(result.news[1].title).toBe('Tech News');
  });

  it('should filter news by period - day', async () => {
    // Arrange
    const now = new Date();
    const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000); // 25 horas atrás
    const today = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 horas atrás

    await newsRepository.create({
      title: 'Yesterday News',
      content: 'Yesterday content',
      publishedAt: yesterday,
      categories: [{ id: 1, name: 'Technology' }]
    });

    await newsRepository.create({
      title: 'Today News',
      content: 'Today content',
      publishedAt: today,
      categories: [{ id: 1, name: 'Technology' }]
    });

    // Act
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10,
      period: 'day'
    });

    // Assert
    expect(result.news).toHaveLength(1);
    expect(result.news[0].title).toBe('Today News');
  });

  it('should filter news by period - week', async () => {
    // Arrange
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000); // 8 dias atrás
    const thisWeek = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 dias atrás

    await newsRepository.create({
      title: 'Last Week News',
      content: 'Last week content',
      publishedAt: lastWeek,
      categories: [{ id: 1, name: 'Technology' }]
    });

    await newsRepository.create({
      title: 'This Week News',
      content: 'This week content',
      publishedAt: thisWeek,
      categories: [{ id: 1, name: 'Technology' }]
    });

    // Act
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10,
      period: 'week'
    });

    // Assert
    expect(result.news).toHaveLength(1);
    expect(result.news[0].title).toBe('This Week News');
  });

  it('should filter news by period - month', async () => {
    // Arrange
    const now = new Date();
    const lastMonth = new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000); // 32 dias atrás
    const thisMonth = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 dias atrás

    await newsRepository.create({
      title: 'Last Month News',
      content: 'Last month content',
      publishedAt: lastMonth,
      categories: [{ id: 1, name: 'Technology' }]
    });

    await newsRepository.create({
      title: 'This Month News',
      content: 'This month content',
      publishedAt: thisMonth,
      categories: [{ id: 1, name: 'Technology' }]
    });

    // Act
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10,
      period: 'month'
    });

    // Assert
    expect(result.news).toHaveLength(1);
    expect(result.news[0].title).toBe('This Month News');
  });

  it('should combine category and period filters', async () => {
    // Arrange
    const now = new Date();
    const today = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 horas atrás
    const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000); // 25 horas atrás

    // Notícia de hoje, categoria Technology
    await newsRepository.create({
      title: 'Today Tech News',
      content: 'Today tech content',
      publishedAt: today,
      categories: [{ id: 1, name: 'Technology' }]
    });

    // Notícia de hoje, categoria Sports
    await newsRepository.create({
      title: 'Today Sports News',
      content: 'Today sports content',
      publishedAt: today,
      categories: [{ id: 2, name: 'Sports' }]
    });

    // Notícia de ontem, categoria Technology
    await newsRepository.create({
      title: 'Yesterday Tech News',
      content: 'Yesterday tech content',
      publishedAt: yesterday,
      categories: [{ id: 1, name: 'Technology' }]
    });

    // Act
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10,
      period: 'day',
      category: 'Technology'
    });

    // Assert
    expect(result.news).toHaveLength(1);
    expect(result.news[0].title).toBe('Today Tech News');
  });

  it('should return correct pagination for second page', async () => {
    // Arrange - Criar 5 notícias
    for (let i = 1; i <= 5; i++) {
      await newsRepository.create({
        title: `News ${i}`,
        content: `Content ${i}`,
        publishedAt: new Date(Date.now() - i * 60 * 60 * 1000), // i horas atrás
        categories: [{ id: 1, name: 'Technology' }]
      });
    }

    // Act - Buscar página 2 com limite 2
    const result = await searchNewsUseCase.execute({
      page: 2,
      limit: 2
    });

    // Assert
    expect(result.news).toHaveLength(2);
    expect(result.pagination.currentPage).toBe(2);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.totalCount).toBe(5);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPreviousPage).toBe(true);
  });

  it('should return empty results when no news match criteria', async () => {
    // Arrange
    await newsRepository.create({
      title: 'Tech News',
      content: 'Tech content',
      publishedAt: new Date('2024-01-01'),
      categories: [{ id: 1, name: 'Technology' }]
    });

    // Act - Buscar categoria que não existe
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10,
      category: 'NonExistentCategory'
    });

    // Assert
    expect(result.news).toHaveLength(0);
    expect(result.pagination.totalCount).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it('should include news categories in the response', async () => {
    // Arrange
    await newsRepository.create({
      title: 'Multi Category News',
      content: 'Multi category content',
      publishedAt: new Date('2024-01-01'),
      categories: [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Business' },
        { id: 3, name: 'Innovation' }
      ]
    });

    // Act
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10
    });

    // Assert
    expect(result.news).toHaveLength(1);
    expect(result.news[0].categories).toHaveLength(3);
    expect(result.news[0].categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, name: 'Technology' }),
        expect.objectContaining({ id: 2, name: 'Business' }),
        expect.objectContaining({ id: 3, name: 'Innovation' })
      ])
    );
  });

  it('should return news with all expected fields', async () => {
    // Arrange
    const testDate = new Date('2024-01-15T10:30:00Z');
    await newsRepository.create({
      title: 'Complete News',
      content: 'Complete news content',
      summary: 'News summary',
      source: 'News Source',
      publishedAt: testDate,
      categories: [{ id: 1, name: 'Technology' }]
    });

    // Act
    const result = await searchNewsUseCase.execute({
      page: 1,
      limit: 10
    });

    // Assert
    expect(result.news).toHaveLength(1);
    const news = result.news[0];
    expect(news).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: 'Complete News',
        content: 'Complete news content',
        summary: 'News summary',
        source: 'News Source',
        publishedAt: testDate,
        categories: expect.arrayContaining([
          expect.objectContaining({ id: 1, name: 'Technology' })
        ])
      })
    );
  });
});