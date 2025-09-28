import { UsersRepository } from "#src/repositories/users_repository.ts";
import { Category } from "#src/repositories/categories_repository.ts";

interface GetUserPreferencesUseCaseResult {
  preferences: Category[];
  totalCount: number;
}

export class GetUserPreferencesUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<GetUserPreferencesUseCaseResult> {
    const preferences = await this.usersRepository.getUserPreferences(userId);

    return {
      preferences,
      totalCount: preferences.length
    };
  }
}