import { describe, expect, it, beforeEach } from 'vitest';
import { GetCategoriesUseCase } from './get_categories';
import { InMemoryCategoriesRepository } from '../repositories/in-memory/in-memory-categories-repository';

describe('Get Categories Use Case', () => {
  let categoriesRepository: InMemoryCategoriesRepository;
  let getCategoriesUseCase: GetCategoriesUseCase;

  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    getCategoriesUseCase = new GetCategoriesUseCase(categoriesRepository);
  });

  it('should return all predefined categories', async () => {
    // Act
    const result = await getCategoriesUseCase.execute();

    // Assert
    expect(result.categories).toHaveLength(5);
    expect(result.totalCount).toBe(5);
    
    // Verificar se contém as categorias padrão
    const categoryNames = result.categories.map(cat => cat.name);
    expect(categoryNames).toContain("Technology");
    expect(categoryNames).toContain("Sports");
    expect(categoryNames).toContain("Politics");
    expect(categoryNames).toContain("Entertainment");
    expect(categoryNames).toContain("Science");
  });

  it('should return categories with correct structure', async () => {
    // Act
    const result = await getCategoriesUseCase.execute();

    // Assert
    expect(result.categories[0]).toHaveProperty('id');
    expect(result.categories[0]).toHaveProperty('name');
    expect(typeof result.categories[0].id).toBe('number');
    expect(typeof result.categories[0].name).toBe('string');
  });

  it('should return correct total count', async () => {
    // Act
    const result = await getCategoriesUseCase.execute();

    // Assert
    expect(result.totalCount).toBe(result.categories.length);
    expect(result.totalCount).toBe(5);
  });
});