import type { FastifyInstance } from "fastify";
import { registerUser } from "./controllers/register_users.controller";
import { searchNews } from "./controllers/search_news.controller";
import { authenticateUser } from "./controllers/authenticate_user.controller";
import { getNewsDetail } from "./controllers/get_news_detail.controller";
import { getCategories } from "./controllers/get_categories.controller";
import { getPreferences } from "./controllers/get_preferences.controller";
import { getUserPreferences } from "./controllers/get_user_preferences.controller";
import { updateUserPreferences } from "./controllers/update_user_preferences.controller";
import { getUserProfile } from "./controllers/get_user_profile.controller";
import { updateUserProfile } from "./controllers/update_user_profile.controller";
import { authMiddleware } from "./middlewares/auth.middleware";

export async function appRoutes(app: FastifyInstance) {

  // ========================================
  // ROTAS DE AUTENTICAÇÃO (públicas)
  // ========================================
  
  // Registro de usuário
  app.post('/auth/register', {
    schema: {
      tags: ['Autenticação'],
      summary: 'Registrar novo usuário',
      description: 'Cria uma nova conta de usuário no sistema',
      body: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          name: { type: 'string', description: 'Nome completo do usuário' },
          email: { type: 'string', format: 'email', description: 'Email válido do usuário' },
          password: { type: 'string', minLength: 6, description: 'Senha com pelo menos 6 caracteres' }
        }
      },
      response: {
        201: { description: 'Usuário registrado com sucesso' },
        409: { description: 'Email já está em uso' },
        400: { description: 'Dados inválidos' }
      }
    }
  }, registerUser);
  
  // Login de usuário
  app.post('/auth/login', {
    schema: {
      tags: ['Autenticação'],
      summary: 'Fazer login',
      description: 'Autentica um usuário e retorna token JWT',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', description: 'Email do usuário' },
          password: { type: 'string', minLength: 6, description: 'Senha do usuário' }
        }
      },
      response: {
        200: { 
          description: 'Login realizado com sucesso',
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Token JWT para autenticação' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' }
              }
            }
          }
        },
        401: { description: 'Credenciais inválidas' },
        400: { description: 'Dados inválidos' }
      }
    }
  }, authenticateUser);

  // ========================================
  // ROTAS DE NOTÍCIAS (protegidas)
  // ========================================

  // Buscar notícias (protegida - só usuários autenticados podem ver)
  app.get('/news', { 
    preHandler: authMiddleware,
    schema: {
      tags: ['Notícias'],
      summary: 'Buscar notícias',
      description: 'Lista notícias com filtros opcionais de paginação, período e categoria',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1, description: 'Número da página' },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10, description: 'Quantidade por página' },
          period: { type: 'string', enum: ['day', 'week', 'month'], description: 'Período de filtro' },
          category: { type: 'string', description: 'Nome da categoria para filtrar' }
        }
      },
      response: {
        200: { description: 'Lista de notícias encontradas' },
        401: { description: 'Token não fornecido ou inválido' },
        400: { description: 'Parâmetros inválidos' }
      }
    }
  }, searchNews);

  // Obter detalhes de uma notícia específica
  app.get('/news/:id', { 
    preHandler: authMiddleware,
    schema: {
      tags: ['Notícias'],
      summary: 'Obter detalhes de uma notícia',
      description: 'Retorna os detalhes completos de uma notícia específica',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', description: 'ID da notícia' }
        }
      },
      response: {
        200: { description: 'Detalhes da notícia' },
        404: { description: 'Notícia não encontrada' },
        401: { description: 'Token não fornecido ou inválido' },
        400: { description: 'ID inválido' }
      }
    }
  }, getNewsDetail);

  // ========================================
  // ROTAS DE CATEGORIAS (protegidas)
  // ========================================

  // Buscar todas as categorias disponíveis
  app.get('/categories', { 
    preHandler: authMiddleware,
    schema: {
      tags: ['Categorias'],
      summary: 'Listar todas as categorias',
      description: 'Retorna todas as categorias de notícias disponíveis no sistema',
      security: [{ bearerAuth: [] }],
      response: {
        200: { description: 'Lista de categorias' },
        401: { description: 'Token não fornecido ou inválido' }
      }
    }
  }, getCategories);

  // ========================================
  // ROTAS DE PREFERÊNCIAS (protegidas)
  // ========================================
  
  // Obter todas as categorias disponíveis para preferências
  app.get('/preferences', { 
    preHandler: authMiddleware,
    schema: {
      tags: ['Preferências'],
      summary: 'Listar preferências disponíveis',
      description: 'Retorna todas as categorias disponíveis para seleção como preferências',
      security: [{ bearerAuth: [] }],
      response: {
        200: { description: 'Lista de preferências disponíveis' },
        401: { description: 'Token não fornecido ou inválido' }
      }
    }
  }, getPreferences);
  
  // Obter preferências do usuário atual
  app.get('/users/me/preferences', { 
    preHandler: authMiddleware,
    schema: {
      tags: ['Preferências'],
      summary: 'Obter preferências do usuário',
      description: 'Retorna as preferências de categoria selecionadas pelo usuário atual',
      security: [{ bearerAuth: [] }],
      response: {
        200: { description: 'Preferências do usuário' },
        401: { description: 'Token não fornecido ou inválido' }
      }
    }
  }, getUserPreferences);
  
  // Atualizar preferências do usuário atual
  app.put('/users/me/preferences', { 
    preHandler: authMiddleware,
    schema: {
      tags: ['Preferências'],
      summary: 'Atualizar preferências do usuário',
      description: 'Atualiza as preferências de categoria do usuário atual',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['categoryIds'],
        properties: {
          categoryIds: {
            type: 'array',
            items: { type: 'number' },
            minItems: 0,
            maxItems: 50,
            description: 'Array com IDs das categorias selecionadas'
          }
        }
      },
      response: {
        200: { description: 'Preferências atualizadas com sucesso' },
        400: { description: 'Dados inválidos' },
        401: { description: 'Token não fornecido ou inválido' },
        404: { description: 'Categoria não encontrada' }
      }
    }
  }, updateUserPreferences);
  
  // ========================================
  // ROTAS DE PERFIL DO USUÁRIO (protegidas)
  // ========================================
  
  // Obter perfil completo do usuário (dados + preferências)
  app.get('/user/profile', { 
    preHandler: authMiddleware,
    schema: {
      tags: ['Perfil'],
      summary: 'Obter perfil do usuário',
      description: 'Retorna os dados completos do perfil do usuário atual, incluindo preferências',
      security: [{ bearerAuth: [] }],
      response: {
        200: { description: 'Perfil do usuário' },
        401: { description: 'Token não fornecido ou inválido' },
        404: { description: 'Usuário não encontrado' }
      }
    }
  }, getUserProfile);
  
  // Atualizar perfil do usuário (nome)
  app.put('/user/profile', { 
    preHandler: authMiddleware,
    schema: {
      tags: ['Perfil'],
      summary: 'Atualizar perfil do usuário',
      description: 'Atualiza os dados do perfil do usuário atual (nome)',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Nome completo do usuário'
          }
        }
      },
      response: {
        200: { description: 'Perfil atualizado com sucesso' },
        400: { description: 'Dados inválidos' },
        401: { description: 'Token não fornecido ou inválido' },
        404: { description: 'Usuário não encontrado' }
      }
    }
  }, updateUserProfile);

}

