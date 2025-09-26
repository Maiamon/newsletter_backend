import { beforeAll } from 'vitest';

beforeAll(() => {
  // Configurar variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-at-least-32-characters-long';
  process.env.JWT_EXPIRES_IN = '1h';
});