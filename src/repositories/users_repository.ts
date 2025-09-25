export interface UserData {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
  createdAt: Date;
}

export interface CreateUserData {
  email: string;
  name?: string;
  password_hash: string;
}

export interface UsersRepository {
  findByEmail(email: string): Promise<UserData | null>;
  create(data: CreateUserData): Promise<UserData>;
}