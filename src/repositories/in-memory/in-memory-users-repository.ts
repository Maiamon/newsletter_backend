import { User } from "../../entities/user_entity.ts";
import { UsersRepository, CreateUserData } from "../users_repository.ts";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

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

}