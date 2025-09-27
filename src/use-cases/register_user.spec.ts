import { describe, expect, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register_user';
import { comparePasswords } from '../service/password_hasher_service';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user_already_exists';


describe('Register Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(usersRepository);
  });

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({ 
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
    })

    const isPasswordCorrectlyHashed = await comparePasswords(
      'password123', 
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  })

  it('should not allow registration with existing email', async () => {
    const email = 'john.doe@example.com'

    await registerUseCase.execute({ 
      name: 'John Doe',
      email: email,
      password: 'password123',
    })

    await expect(() => 
      registerUseCase.execute({ 
        name: 'Jane Doe',
        email: email,
        password: 'password456',
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register a new user', async () => {
    const { user } = await registerUseCase.execute({ 
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
    })

    expect(user.id).toEqual(expect.any(String));
  })

  it('should create user with correct data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const { user } = await registerUseCase.execute(userData);

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: userData.name,
        email: userData.email,
        password_hash: expect.any(String),
        createdAt: expect.any(Date),
      })
    );
    
    // Verificar que a senha não é armazenada em texto plano
    expect(user.password_hash).not.toBe(userData.password);
  })

  it('should generate unique IDs for different users', async () => {
    const user1Data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const user2Data = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password456',
    };

    const { user: user1 } = await registerUseCase.execute(user1Data);
    const { user: user2 } = await registerUseCase.execute(user2Data);

    expect(user1.id).not.toBe(user2.id);
    expect(user1.id).toEqual(expect.any(String));
    expect(user2.id).toEqual(expect.any(String));
  })

  it('should hash different passwords differently', async () => {
    const user1Data = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const user2Data = {
      name: 'Jane Smith',
      email: 'jane@example.com',  
      password: 'differentpassword456',
    };

    const { user: user1 } = await registerUseCase.execute(user1Data);
    const { user: user2 } = await registerUseCase.execute(user2Data);

    // As senhas hashadas devem ser diferentes
    expect(user1.password_hash).not.toBe(user2.password_hash);
    
    // Mas ambas devem funcionar quando verificadas
    const isUser1PasswordValid = await comparePasswords(user1Data.password, user1.password_hash);
    const isUser2PasswordValid = await comparePasswords(user2Data.password, user2.password_hash);
    
    expect(isUser1PasswordValid).toBe(true);
    expect(isUser2PasswordValid).toBe(true);
  })

  it('should not allow registration with same email case insensitive', async () => {
    const email = 'john.doe@example.com';
    const emailUpperCase = 'JOHN.DOE@EXAMPLE.COM';

    await registerUseCase.execute({ 
      name: 'John Doe',
      email: email,
      password: 'password123',
    });

    // Mesmo email em maiúscula deve falhar
    await expect(() => 
      registerUseCase.execute({ 
        name: 'Jane Doe',
        email: emailUpperCase,
        password: 'password456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  })

  it('should set createdAt timestamp correctly', async () => {
    const beforeCreation = new Date();
    
    const { user } = await registerUseCase.execute({ 
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });
    
    const afterCreation = new Date();

    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
    expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
  })

  it('should handle multiple users with same name but different emails', async () => {
    const user1 = {
      name: 'John Doe',
      email: 'john1@example.com',
      password: 'password123',
    };

    const user2 = {
      name: 'John Doe', // Mesmo nome
      email: 'john2@example.com', // Email diferente
      password: 'password456',
    };

    const { user: registeredUser1 } = await registerUseCase.execute(user1);
    const { user: registeredUser2 } = await registerUseCase.execute(user2);

    expect(registeredUser1.name).toBe(registeredUser2.name);
    expect(registeredUser1.email).not.toBe(registeredUser2.email);
    expect(registeredUser1.id).not.toBe(registeredUser2.id);
  })

})