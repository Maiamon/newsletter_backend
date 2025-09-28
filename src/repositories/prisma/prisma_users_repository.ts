import { prisma } from "#lib/prisma.ts";
import { User } from "../../entities/user_entity.ts";
import { UsersRepository, CreateUserData } from "../users_repository.ts";
import { Category } from "../categories_repository.ts";

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase() // Buscar sempre em lowercase
      }
    });

    return user;
  }
  
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user;
  }
  
  async create(data: CreateUserData): Promise<User> {
    const user = await prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase() // Salvar sempre em lowercase
      },
    });

    return user;
  }

  async getUserPreferences(userId: string): Promise<Category[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferredCategories: {
          orderBy: {
            name: 'asc'
          }
        }
      }
    });

    if (!user) {
      return [];
    }

    return user.preferredCategories.map(category => ({
      id: category.id,
      name: category.name
    }));
  }

  async updateUserPreferences(userId: string, categoryIds: number[]): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        preferredCategories: {
          set: categoryIds.map(id => ({ id }))
        }
      }
    });
  }
}