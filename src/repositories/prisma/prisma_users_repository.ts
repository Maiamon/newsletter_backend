import { prisma } from "#lib/prisma.ts";
import { UsersRepository, UserData, CreateUserData } from "../users_repository.ts";

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<UserData | null> {
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase() // Buscar sempre em lowercase
      }
    });

    return user;
  }
  
  async create(data: CreateUserData): Promise<UserData> {
    const user = await prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase() // Salvar sempre em lowercase
      },
    });

    return user;
  }
}