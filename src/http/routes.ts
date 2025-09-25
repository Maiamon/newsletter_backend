import type { FastifyInstance } from "fastify";
import { registerNews } from "./controllers/register_news.controller.ts";
import { registerUser } from "./controllers/register_users.controller.ts";
import { searchNews } from "./controllers/search_news.controller.ts";
import { authenticateUser } from "./controllers/authenticate_user.controller.ts";

export async function appRoutes(app: FastifyInstance) {

  // TODO: Levar essa rota para o agente curador e tirar do backend
  app.post('/news', registerNews);

    app.get('/news', searchNews);

  app.post('/users', registerUser);

  app.post('/login', authenticateUser);

  // TODO: Implementar GET /preferences

  // TODO: Implementar GET /users/me/preferences

  // TODO: Implementar PUT /users/me/preferences

}

