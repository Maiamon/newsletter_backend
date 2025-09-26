import { describe, expect, it, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate_user';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { TokenExpiredError, InvalidTokenError, TokenMalformedError } from './errors/jwt_errors';
import { hashPassword } from '../repositories/bcrypt';
import { verifyJWT } from '../repositories/jwt';
import { env } from '#src/env/index.ts';
import * as jose from 'jose';

describe('Authenticate Use Case - JWT Error Handling', () => {
  let usersRepository: InMemoryUsersRepository;
  let authenticateUseCase: AuthenticateUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUseCase(usersRepository);
  });

  it('should generate a valid JWT token on successful authentication', async () => {
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

      // Assert - Verificar se o token é válido
      const payload = await verifyJWT(result.token);
      expect(payload).toEqual(
        expect.objectContaining({
          userId: expect.any(String),
          email: email.toLowerCase(), // Email normalizado
        })
      );
    });

    it('should include correct user data in JWT payload', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'JOHN.DOE@EXAMPLE.COM', // Teste com maiúsculas
      };
      const password = 'password123';
      const hashedPassword = await hashPassword(password);

      const createdUser = await usersRepository.create({
        name: userData.name,
        email: userData.email,
        password_hash: hashedPassword,
      });

      // Act
      const result = await authenticateUseCase.execute({
        email: userData.email,
        password,
      });

      // Assert
      const payload = await verifyJWT(result.token);
      expect(payload.userId).toBe(createdUser.id);
      expect(payload.email).toBe(userData.email.toLowerCase());
    });

  // JWT Token Verification Error Tests
  it('should handle invalid token format', async () => {
      const invalidToken = 'invalid.token.format';

      await expect(() => verifyJWT(invalidToken)).rejects.toBeInstanceOf(TokenMalformedError);
    });

    it('should handle completely malformed token', async () => {
      const malformedToken = 'not-a-jwt-token-at-all';

      await expect(() => verifyJWT(malformedToken)).rejects.toBeInstanceOf(TokenMalformedError);
    });

    it('should handle token with invalid signature', async () => {
      // Arrange - Criar um token com chave diferente
      const fakeSecretKey = new TextEncoder().encode('fake-secret-key-for-testing');
      const fakeToken = await new jose.SignJWT({ userId: '123', email: 'test@example.com' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(fakeSecretKey);

      // Act & Assert
      await expect(() => verifyJWT(fakeToken)).rejects.toBeInstanceOf(InvalidTokenError);
    });

    it('should handle expired token', async () => {
      // Arrange - Criar um token que já expirou usando a mesma chave do ambiente
      const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET);
      const expiredToken = await new jose.SignJWT({ userId: '123', email: 'test@example.com' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('-1h') // Token expirado há 1 hora
        .sign(SECRET_KEY);

      // Act & Assert
      await expect(() => verifyJWT(expiredToken)).rejects.toBeInstanceOf(TokenExpiredError);
    });

    it('should handle empty token', async () => {
      const emptyToken = '';

      await expect(() => verifyJWT(emptyToken)).rejects.toBeInstanceOf(TokenMalformedError);
    });

  // JWT Integration with Authentication Tests
    it('should authenticate and return verifiable token', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await hashPassword(password);

      const user = await usersRepository.create({
        name: 'Test User',
        email,
        password_hash: hashedPassword,
      });

      // Act
      const authResult = await authenticateUseCase.execute({
        email,
        password,
      });

      // Assert - Token deve ser verificável
      const verifiedPayload = await verifyJWT(authResult.token);
      expect(verifiedPayload.userId).toBe(user.id);
      expect(verifiedPayload.email).toBe(email.toLowerCase());
    });

    it('should generate valid tokens for multiple authentications', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await hashPassword(password);

      await usersRepository.create({
        name: 'Test User',
        email,
        password_hash: hashedPassword,
      });

      // Act - Gerar múltiplos tokens
      const result1 = await authenticateUseCase.execute({ email, password });
      const result2 = await authenticateUseCase.execute({ email, password });

      // Assert - Ambos tokens devem ser válidos
      const payload1 = await verifyJWT(result1.token);
      const payload2 = await verifyJWT(result2.token);
      
      expect(payload1.userId).toBe(payload2.userId);
      expect(payload1.email).toBe(payload2.email);
      expect(payload1.email).toBe(email.toLowerCase());
    });
});