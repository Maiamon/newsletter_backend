import { UsersRepository } from "#src/repositories/users_repository.ts";
import { CategoriesRepository } from "#src/repositories/categories_repository.ts";

interface UpdateUserPreferencesUseCaseProps {
  userId: string;
  categoryIds: number[];
}

interface UpdateUserPreferencesUseCaseResult {
  success: boolean;
  updatedPreferences: number;
}

export class UpdateUserPreferencesUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository
  ) {}

  async execute({ userId, categoryIds }: UpdateUserPreferencesUseCaseProps): Promise<UpdateUserPreferencesUseCaseResult> {
    // Verificar se o usuário existe
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verificar se todas as categorias existem
    const allCategories = await this.categoriesRepository.findAll();
    const validCategoryIds = allCategories.map(cat => cat.id);
    
    const invalidCategories = categoryIds.filter(id => !validCategoryIds.includes(id));
    if (invalidCategories.length > 0) {
      throw new Error(`Invalid category IDs: ${invalidCategories.join(', ')}`);
    }

    // Atualizar as preferências do usuário
    await this.usersRepository.updateUserPreferences(userId, categoryIds);

    return {
      success: true,
      updatedPreferences: categoryIds.length
    };
  }
}