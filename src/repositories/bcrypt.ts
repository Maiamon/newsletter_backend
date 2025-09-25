import bcrypt from "bcryptjs";

//TODO : Dar uma olhada na geração do Salt e na segurança comparado a apenas gerar hash com rodadas
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(6);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
