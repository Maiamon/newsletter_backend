import { describe, expect, it, beforeEach } from 'vitest';
import { GetCategoriesUseCase } from './get_categories';
import { InMemoryNewsRepository } from '../repositories/in-memory/in-memory-news-repository';

describe('Get Categories Use Case', () => {
  let newsRepository: InMemoryNewsRepository;
  let getCategoriesUseCase: GetCategoriesUseCase;

  beforeEach(() => {
    newsRepository = new InMemoryNewsRepository();
    getCategoriesUseCase = new GetCategoriesUseCase(newsRepository);
  });

  it('should return empty categories when no categories exist', async () => {
    // Act
    const result = await getCategoriesUseCase.execute();

    // Assert
    expect(result.categories).toHaveLength(0);
    expect(result.totalCount).toBe(0);
  });

  it('should return all categories ordered by name', async () => {
    // Arrange - Adicionar categorias diretamente
    newsRepository.addCategory({ id: 1, name: 'Technology' });
    newsRepository.addCategory({ id: 2, name: 'Innovation' });
    newsRepository.addCategory({ id: 3, name: 'Sports' });

    // Act
    const result = await getCategoriesUseCase.execute();

    // Assert
    expect(result.categories).toHaveLength(3);
    expect(result.totalCount).toBe(3);
    
    // Verificar se as categorias estão ordenadas por nome
    expect(result.categories[0].name).toBe('Innovation');
    expect(result.categories[1].name).toBe('Sports');
    expect(result.categories[2].name).toBe('Technology');
    
    // Verificar estrutura das categorias
    expect(result.categories[0]).toEqual({ id: 2, name: 'Innovation' });
    expect(result.categories[1]).toEqual({ id: 3, name: 'Sports' });
    expect(result.categories[2]).toEqual({ id: 1, name: 'Technology' });
  });

  it('should return categories independent of news existence', async () => {
    // Arrange - Adicionar categoria sem criar notícias
    newsRepository.addCategory({ id: 1, name: 'Technology' });

    // Act
    const result = await getCategoriesUseCase.execute();

    // Assert
    expect(result.categories).toHaveLength(1);
    expect(result.totalCount).toBe(1);
    expect(result.categories[0]).toEqual({ id: 1, name: 'Technology' });
  });

  it('should handle multiple categories correctly', async () => {
    // Arrange - Adicionar várias categorias
    newsRepository.addCategory({ id: 1, name: 'Technology' });
    newsRepository.addCategory({ id: 2, name: 'Programming' });
    newsRepository.addCategory({ id: 3, name: 'AI' });
    newsRepository.addCategory({ id: 4, name: 'Web Development' });

    // Act
    const result = await getCategoriesUseCase.execute();

    // Assert
    expect(result.categories).toHaveLength(4);
    expect(result.totalCount).toBe(4);
    
    // Verificar ordenação alfabética
    expect(result.categories[0]).toEqual({ id: 3, name: 'AI' });
    expect(result.categories[1]).toEqual({ id: 2, name: 'Programming' });
    expect(result.categories[2]).toEqual({ id: 1, name: 'Technology' });
    expect(result.categories[3]).toEqual({ id: 4, name: 'Web Development' });
  });
});