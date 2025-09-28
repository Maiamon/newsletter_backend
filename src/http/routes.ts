import type { FastifyInstance } from "fastify";
import { registerUser } from "./controllers/register_users.controller";
import { searchNews } from "./controllers/search_news.controller";
import { authenticateUser } from "./controllers/authenticate_user.controller";
import { getNewsDetail } from "./controllers/get_news_detail.controller";
import { getCategories } from "./controllers/get_categories.controller";
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
  // ROTAS FUTURAS (para implementar)
  // ========================================
  
  // TODO: Implementar rotas de preferências do usuário
  // app.get('/user/preferences', { preHandler: authMiddleware }, getUserPreferences);
  // app.put('/user/preferences', { preHandler: authMiddleware }, updateUserPreferences);
  
  // TODO: Implementar rotas de perfil do usuário
  // app.get('/user/profile', { preHandler: authMiddleware }, getUserProfile);
  // app.put('/user/profile', { preHandler: authMiddleware }, updateUserProfile);

}

