import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyJWT, type JWTPayload } from '#src/service/jwt_service.ts';
import { 
  TokenExpiredError, 
  InvalidTokenError, 
  TokenMalformedError 
} from '#use-cases/errors/jwt_errors.ts';

// Estender o tipo do FastifyRequest para incluir o usuário autenticado
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}

/**
 * Middleware de autenticação JWT
 * Verifica se o token JWT está presente e válido
 * Adiciona as informações do usuário no request.user
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Buscar o token no header Authorization
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.status(401).send({ 
        message: 'Token de acesso requerido' 
      });
    }
    
    // Verificar se o header está no formato "Bearer <token>"
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      return reply.status(401).send({ 
        message: 'Formato do token inválido. Use: Bearer <token>' 
      });
    }
    
    // Verificar e decodificar o token
    const payload = await verifyJWT(token);
    
    // Adicionar as informações do usuário no request
    request.user = payload as JWTPayload;
    
  } catch (error) {
    console.log('🔐 Authentication error:', error);
    
    if (error instanceof TokenExpiredError) {
      return reply.status(401).send({ 
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error instanceof InvalidTokenError) {
      return reply.status(401).send({ 
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error instanceof TokenMalformedError) {
      return reply.status(401).send({ 
        message: 'Token malformado',
        code: 'TOKEN_MALFORMED'
      });
    }
    
    // Erro genérico de autenticação
    return reply.status(401).send({ 
      message: 'Falha na autenticação',
      code: 'AUTH_FAILED'
    });
  }
}

/**
 * Middleware opcional de autenticação
 * Se o token estiver presente, valida e adiciona o usuário
 * Se não estiver presente, continua sem erro
 */
export async function optionalAuthMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      // Sem token, mas não é erro - continua sem usuário
      return;
    }
    
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      // Token malformado, mas opcional - continua sem usuário
      return;
    }
    
    // Tentar verificar o token
    const payload = await verifyJWT(token);
    request.user = payload as JWTPayload;
    
  } catch (error) {
    // Em caso de erro no token opcional, apenas log e continua
    console.log('🔐 Optional auth failed (continuing anyway):', error);
  }
}