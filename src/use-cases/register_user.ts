import { hashPassword } from "#repositories/bcrypt.ts";
import { UsersRepository } from "#repositories/users_repository.ts";
import { UserAlreadyExistsError } from "./errors/user_already_exists.ts";

interface RegisterUseCaseProps {
  email: string;
  name: string;
  password: string;
}

export class RegisterUseCase {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({ email, name, password }: RegisterUseCaseProps) {
    const password_hash = await hashPassword(password);

    // Verifica se o usuário já existe
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    await this.usersRepository.create({
      email,
      name,
      password_hash: password_hash,
    });
  }
}