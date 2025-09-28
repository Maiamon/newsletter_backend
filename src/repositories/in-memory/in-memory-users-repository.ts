import { User } from "../../entities/user_entity.ts";
import { UsersRepository, CreateUserData } from "../users_repository.ts";
import { Category } from "../categories_repository.ts";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];
  private userPreferences: Map<string, number[]> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: CreateUserData): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name ?? null,
      email: data.email.toLowerCase(), // Normalizar email para lowercase
      password_hash: data.password_hash,
      createdAt: new Date(),
    }

    this.items.push(user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);
    return user || null;
  }

  async getUserPreferences(userId: string): Promise<Category[]> {
    const categoryIds = this.userPreferences.get(userId) || [];
    
    // Simulando busca das categorias (em um cenário real, você teria acesso ao repositório de categorias)
    // Por simplicidade, vou retornar categorias mock baseadas nos IDs
    const mockCategories: Category[] = [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Sports' },
      { id: 3, name: 'Business' },
      { id: 4, name: 'Entertainment' }
    ];

    return mockCategories
      .filter(category => categoryIds.includes(category.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateUserPreferences(userId: string, categoryIds: number[]): Promise<void> {
    this.userPreferences.set(userId, [...categoryIds]);
  }

}