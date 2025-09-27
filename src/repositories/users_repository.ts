import { User } from "../entities/user_entity";

export interface CreateUserData {
  email: string;
  name: string;
  password_hash: string;
}

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}