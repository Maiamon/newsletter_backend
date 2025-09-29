import { AuthenticateUseCase } from "#src/use-cases/authenticate_user.ts";
import { RegisterUseCase } from "#src/use-cases/register_user.ts";
import { GetCategoriesUseCase } from "#src/use-cases/get_categories.ts";
import { GetUserPreferencesUseCase } from "#src/use-cases/get_user_preferences.ts";
import { UpdateUserPreferencesUseCase } from "#src/use-cases/update_user_preferences.ts";
import { GetUserProfileUseCase } from "#src/use-cases/get_user_profile.ts";
import { UpdateUserProfileUseCase } from "#src/use-cases/update_user_profile.ts";
import { SearchNewsUseCase } from "#src/use-cases/list_news.ts";
import { GetNewsDetailUseCase } from "#src/use-cases/get_news_detail.ts";
import { RepositoryFactory } from "./repository-factory.ts";

export class UseCaseFactory {
  static createAuthenticateUseCase(): AuthenticateUseCase {
    const usersRepository = RepositoryFactory.createUsersRepository();
    return new AuthenticateUseCase(usersRepository);
  }

  static createRegisterUserUseCase(): RegisterUseCase {
    const usersRepository = RepositoryFactory.createUsersRepository();
    return new RegisterUseCase(usersRepository);
  }

  static createGetCategoriesUseCase(): GetCategoriesUseCase {
    const categoriesRepository = RepositoryFactory.createCategoriesRepository();
    return new GetCategoriesUseCase(categoriesRepository);
  }

  static createGetUserPreferencesUseCase(): GetUserPreferencesUseCase {
    const usersRepository = RepositoryFactory.createUsersRepository();
    return new GetUserPreferencesUseCase(usersRepository);
  }

  static createUpdateUserPreferencesUseCase(): UpdateUserPreferencesUseCase {
    const usersRepository = RepositoryFactory.createUsersRepository();
    const categoriesRepository = RepositoryFactory.createCategoriesRepository();
    return new UpdateUserPreferencesUseCase(usersRepository, categoriesRepository);
  }

  static createSearchNewsUseCase(): SearchNewsUseCase {
    const newsRepository = RepositoryFactory.createNewsRepository();
    return new SearchNewsUseCase(newsRepository);
  }

  static createGetNewsDetailUseCase(): GetNewsDetailUseCase {
    const newsRepository = RepositoryFactory.createNewsRepository();
    return new GetNewsDetailUseCase(newsRepository);
  }

  static createGetUserProfileUseCase(): GetUserProfileUseCase {
    const usersRepository = RepositoryFactory.createUsersRepository();
    return new GetUserProfileUseCase(usersRepository);
  }

  static createUpdateUserProfileUseCase(): UpdateUserProfileUseCase {
    const usersRepository = RepositoryFactory.createUsersRepository();
    return new UpdateUserProfileUseCase(usersRepository);
  }
}