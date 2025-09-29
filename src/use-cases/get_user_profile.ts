import { UsersRepository } from "#src/repositories/users_repository.ts";
import { Category } from "#src/repositories/categories_repository.ts";

interface GetUserProfileUseCaseResult {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
  preferences: Category[];
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<GetUserProfileUseCaseResult> {
    // Buscar dados do usuário
    const user = await this.usersRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Buscar preferências do usuário
    const preferences = await this.usersRepository.getUserPreferences(userId);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      preferences
    };
  }
}