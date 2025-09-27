import { describe, expect, it, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate_user';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { InvalidCredentialsError } from './errors/invalid_credentials';
import { hashPassword } from '../service/password_hasher_service';

describe('Authenticate Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let authenticateUseCase: AuthenticateUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate a user with valid credentials', async () => {
    // Arrange - Criar um usuário no repositório
    const email = 'john.doe@example.com';
    const password = 'password123';
    const hashedPassword = await hashPassword(password);

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: hashedPassword,
    });

    // Act - Tentar autenticar
    const result = await authenticateUseCase.execute({
      email,
      password,
    });

    // Assert - Verificar se retornou um token
    expect(result).toEqual({
      token: expect.any(String),
    });
    expect(result.token).toBeTruthy();
    expect(result.token.length).toBeGreaterThan(0);
  });

  it('should not be able to authenticate with non-existent email', async () => {
    // Arrange
    const email = 'nonexistent@example.com';
    const password = 'password123';

    // Act & Assert - Deve lançar erro
    await expect(() =>
      authenticateUseCase.execute({
        email,
        password,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    // Arrange - Criar usuário com senha específica
    const email = 'john.doe@example.com';
    const correctPassword = 'password123';
    const wrongPassword = 'wrongpassword';
    const hashedPassword = await hashPassword(correctPassword);

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: hashedPassword,
    });

    // Act & Assert - Deve lançar erro com senha errada
    await expect(() =>
      authenticateUseCase.execute({
        email,
        password: wrongPassword,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should throw InvalidCredentialsError for both non-existent user and wrong password', async () => {
    // Arrange - Criar usuário
    const validEmail = 'john.doe@example.com';
    const password = 'password123';
    const hashedPassword = await hashPassword(password);

    await usersRepository.create({
      name: 'John Doe',
      email: validEmail,
      password_hash: hashedPassword,
    });

    // Act & Assert - Testar ambos os casos retornam o mesmo tipo de erro
    const nonExistentUserError = authenticateUseCase.execute({
      email: 'nonexistent@example.com',
      password: 'anypassword',
    });

    const wrongPasswordError = authenticateUseCase.execute({
      email: validEmail,
      password: 'wrongpassword',
    });

    // Ambos devem lançar o mesmo tipo de erro (segurança)
    await expect(nonExistentUserError).rejects.toBeInstanceOf(InvalidCredentialsError);
    await expect(wrongPasswordError).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should return a valid JWT token structure', async () => {
    // Arrange
    const email = 'john.doe@example.com';
    const password = 'password123';
    const hashedPassword = await hashPassword(password);

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: hashedPassword,
    });

    // Act
    const result = await authenticateUseCase.execute({
      email,
      password,
    });

    // Assert - Verificar estrutura do JWT (formato básico)
    const tokenParts = result.token.split('.');
    expect(tokenParts).toHaveLength(3); // Header.Payload.Signature
    expect(tokenParts[0]).toBeTruthy(); // Header
    expect(tokenParts[1]).toBeTruthy(); // Payload
    expect(tokenParts[2]).toBeTruthy(); // Signature
  });

  it('should authenticate users with different passwords correctly', async () => {
    // Arrange - Criar múltiplos usuários
    const user1 = {
      email: 'user1@example.com',
      password: 'password123',
      name: 'User One',
    };
    const user2 = {
      email: 'user2@example.com',
      password: 'differentpassword456',
      name: 'User Two',
    };

    const hashedPassword1 = await hashPassword(user1.password);
    const hashedPassword2 = await hashPassword(user2.password);

    await usersRepository.create({
      name: user1.name,
      email: user1.email,
      password_hash: hashedPassword1,
    });

    await usersRepository.create({
      name: user2.name,
      email: user2.email,
      password_hash: hashedPassword2,
    });

    // Act & Assert - Ambos devem conseguir se autenticar
    const result1 = await authenticateUseCase.execute({
      email: user1.email,
      password: user1.password,
    });

    const result2 = await authenticateUseCase.execute({
      email: user2.email,
      password: user2.password,
    });

    expect(result1.token).toBeTruthy();
    expect(result2.token).toBeTruthy();
    expect(result1.token).not.toBe(result2.token); // Tokens devem ser diferentes
  });

  it('should not authenticate user1 with user2 password', async () => {
    // Arrange - Criar dois usuários
    const user1 = {
      email: 'user1@example.com',
      password: 'password123',
    };
    const user2 = {
      email: 'user2@example.com',
      password: 'differentpassword456',
    };

    await usersRepository.create({
      name: 'User One',
      email: user1.email,
      password_hash: await hashPassword(user1.password),
    });

    await usersRepository.create({
      name: 'User Two',
      email: user2.email,
      password_hash: await hashPassword(user2.password),
    });

    // Act & Assert - User1 não deve conseguir usar senha do User2
    await expect(() =>
      authenticateUseCase.execute({
        email: user1.email,
        password: user2.password,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
