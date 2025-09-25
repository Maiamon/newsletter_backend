import { prisma } from "#lib/prisma.ts";
import { hashPassword } from "#lib/bcrypt.ts";

interface RegisterUseCaseProps {
  email: string;
  name: string;
  password: string;
}

export async function registerUseCase({ email, name, password }: RegisterUseCaseProps) {

  // Verifica se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  await prisma.user.create({
    data: {
      email,
      name,
      password_hash: await hashPassword(password),
    }
  });
}