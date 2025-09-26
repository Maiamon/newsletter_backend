import { UsersRepository, UserData, CreateUserData } from "../users_repository.ts";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: UserData[] = [];

  async findByEmail(email: string): Promise<UserData | null> {
    const user = this.items.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: CreateUserData): Promise<UserData> {
    const user: UserData = {
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

// export class PrismaUsersRepository implements UsersRepository {
//   async findByEmail(email: string): Promise<UserData | null> {
//     const user = await prisma.user.findUnique({
//       where: { 
//         email 
//       }
//     });

//     return user;
//   }
  
//   async create(data: CreateUserData): Promise<UserData> {
//     const user = await prisma.user.create({
//       data,
//     });

//     return user;
//   }
// }