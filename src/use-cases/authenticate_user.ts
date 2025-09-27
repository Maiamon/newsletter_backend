import { comparePasswords } from "#src/service/password_hasher_service.ts";
import { generateJWT } from "#src/service/jwt_service.ts";
import { UsersRepository } from "#repositories/users_repository.ts";
import { InvalidCredentialsError } from "./errors/invalid_credentials";

interface AuthenticateUseCaseParams {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResult {
  token: string;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: AuthenticateUseCaseParams): Promise<AuthenticateUseCaseResult> {
    // Buscar usuário pelo email
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Verificar senha
    const isPasswordValid = await comparePasswords(password, user.password_hash);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Gerar token JWT
    const token = await generateJWT({
      userId: user.id,
      email: user.email
    });

    return { token };
  }
}