import { prisma } from "#src/lib/prisma.ts";
import type { Category, CategoriesRepository } from "../categories_repository.ts";

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return categories;
  }

  async findById(id: number): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id }
    });

    return category;
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: ids
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return categories;
  }
}