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
  app.post('/auth/register', registerUser);
  
  // Login de usuário
  app.post('/auth/login', authenticateUser);

  // ========================================
  // ROTAS DE NOTÍCIAS (protegidas)
  // ========================================

  // Buscar notícias (protegida - só usuários autenticados podem ver)
  app.get('/news', { preHandler: authMiddleware }, searchNews);

  // Obter detalhes de uma notícia específica
  app.get('/news/:id', { preHandler: authMiddleware }, getNewsDetail);

  // ========================================
  // ROTAS DE CATEGORIAS (protegidas)
  // ========================================

  // Buscar todas as categorias disponíveis
  app.get('/categories', { preHandler: authMiddleware }, getCategories);

  // ========================================
  // ROTAS DE PREFERÊNCIAS (protegidas)
  // ========================================
  
  // Obter todas as categorias disponíveis para preferências
  app.get('/preferences', { preHandler: authMiddleware }, getPreferences);
  
  // Obter preferências do usuário atual
  app.get('/users/me/preferences', { preHandler: authMiddleware }, getUserPreferences);
  
  // Atualizar preferências do usuário atual
  app.put('/users/me/preferences', { preHandler: authMiddleware }, updateUserPreferences);
  
  // ========================================
  // ROTAS DE PERFIL DO USUÁRIO (protegidas)
  // ========================================
  
  // Obter perfil completo do usuário (dados + preferências)
  app.get('/user/profile', { preHandler: authMiddleware }, getUserProfile);
  
  // Atualizar perfil do usuário (nome)
  app.put('/user/profile', { preHandler: authMiddleware }, updateUserProfile);

}

