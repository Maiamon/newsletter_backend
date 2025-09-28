import { PrismaUsersRepository } from "#src/repositories/prisma/prisma_users_repository.ts";
import { PrismaCategoriesRepository } from "#src/repositories/prisma/prisma_categories_repository.ts";
import { PrismaNewsRepository } from "#src/repositories/prisma/prisma_news_repository.ts";
import type { UsersRepository } from "#src/repositories/users_repository.ts";
import type { CategoriesRepository } from "#src/repositories/categories_repository.ts";
import type { NewsRepository } from "#src/repositories/news_repository.ts";

export class RepositoryFactory {
  static createUsersRepository(): UsersRepository {
    return new PrismaUsersRepository();
  }

  static createCategoriesRepository(): CategoriesRepository {
    return new PrismaCategoriesRepository();
  }

  static createNewsRepository(): NewsRepository {
    return new PrismaNewsRepository();
  }
}