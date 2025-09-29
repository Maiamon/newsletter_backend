import { User } from "../entities/user_entity";
import { Category } from "./categories_repository";

export interface CreateUserData {
  email: string;
  name: string;
  password_hash: string;
}

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  getUserPreferences(userId: string): Promise<Category[]>;
  updateUserPreferences(userId: string, categoryIds: number[]): Promise<void>;
  updateUserName(userId: string, name: string): Promise<void>;
}