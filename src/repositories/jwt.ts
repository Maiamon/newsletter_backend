import * as jose from 'jose';
import { env } from '#src/env/index.ts';
import { 
  TokenExpiredError, 
  InvalidTokenError, 
  TokenMalformedError 
} from '../use-cases/errors/jwt_errors';

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET);

export interface JWTPayload {
  // Propriedades obrigatórias da nossa aplicação
  userId: string;
  email: string;
  
  // Permite propriedades adicionais para compatibilidade com jose
  [key: string]: unknown;
}

export interface RefreshTokenPayload {
  userId: string;
  email: string;
  tokenVersion: number; // Para invalidar tokens antigos
  [key: string]: unknown;
}

/**
 * Gera um token JWT de acesso
 * Expira em tempo configurável (padrão 2h)
 */
export async function generateJWT(props: JWTPayload): Promise<string> {
  const token = await new jose.SignJWT(props)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(SECRET_KEY);

  return token;
}

/**
 * Gera um refresh token para renovação
 * Expira em 7 dias (mais longo que o access token)
 */
export async function generateRefreshToken(props: RefreshTokenPayload): Promise<string> {
  const token = await new jose.SignJWT(props)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verifica e decodifica um token JWT
 * Lança exceções específicas para diferentes tipos de erro
 */
export async function verifyJWT(token: string): Promise<jose.JWTPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = error instanceof Error && 'code' in error ? error.code : '';
    
    // Verificar se é erro de token expirado
    if (errorCode === 'ERR_JWT_EXPIRED' || errorMessage.includes('expired')) {
      throw new TokenExpiredError();
    }
    
    // Verificar se é erro de assinatura inválida
    if (errorCode === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || 
        errorMessage.includes('signature verification failed')) {
      throw new InvalidTokenError();
    }
    
    // Verificar se é erro de formato/estrutura
    if (errorCode === 'ERR_JWT_MALFORMED' || 
        errorMessage.includes('malformed') ||
        errorMessage.includes('invalid')) {
      throw new TokenMalformedError();
    }
    
    // Para qualquer outro erro JWT
    throw new InvalidTokenError();
  }
}

/**
 * Extrai informações do token sem verificar (use com cuidado!)
 * Útil para debug ou verificações que não envolvem segurança
 */
export function decodeJWT(token: string): jose.JWTPayload | null {
  try {
    return jose.decodeJwt(token);
  } catch {
    return null;
  }
}