import { UsersRepository } from "#src/repositories/users_repository.ts";

interface UpdateUserProfileUseCaseParams {
  userId: string;
  name: string;
}

interface UpdateUserProfileUseCaseResult {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
}

export class UpdateUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, name }: UpdateUserProfileUseCaseParams): Promise<UpdateUserProfileUseCaseResult> {
    // Verificar se o usuário existe
    const user = await this.usersRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Validar se o nome não está vazio
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    // Atualizar o nome do usuário
    await this.usersRepository.updateUserName(userId, name.trim());

    // Buscar dados atualizados do usuário
    const updatedUser = await this.usersRepository.findById(userId);

    return {
      success: true,
      user: {
        id: updatedUser!.id,
        name: updatedUser!.name,
        email: updatedUser!.email,
        createdAt: updatedUser!.createdAt
      }
    };
  }
}