import * as jose from 'jose';

//TODO: Colocar a senha na Env, e importar aqui
const SECRET_KEY = new TextEncoder().encode("supersecretkey");

// TODO: perguntar do chatGPT sobre experation time na prática e como atualizar o token se o usuario continuar usando a aplicação
export async function generateJWT(props: any) {
  const token = await new jose.SignJWT(props)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET_KEY);

  return token;
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    // TODO: Logar o erro corretamente e criar o tipo de erro
    console.error("Invalid token:", error);
    return null;
  }
}