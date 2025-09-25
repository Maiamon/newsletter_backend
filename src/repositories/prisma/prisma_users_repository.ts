import { prisma } from "#lib/prisma.ts";
import { UsersRepository, UserData, CreateUserData } from "../users_repository.ts";

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<UserData | null> {
    const user = await prisma.user.findUnique({
      where: { 
        email 
      }
    });

    return user;
  }
  
  async create(data: CreateUserData): Promise<UserData> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}