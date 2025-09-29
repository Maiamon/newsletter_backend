import fastify from "fastify";
import fastifyCors from '@fastify/cors';
import { appRoutes } from "#http/routes.ts";
import { treeifyError, ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

// Configuração do Swagger
await app.register(import('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'Newsletter Backend API',
      description: 'API para sistema de newsletter com autenticação JWT, categorias e preferências de usuário',
      version: '1.0.0',
    },
    host: 'localhost:3333',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT token. Formato: Bearer <token>',
      },
    },
    tags: [
      { name: 'Autenticação', description: 'Endpoints de registro e login' },
      { name: 'Notícias', description: 'Endpoints para buscar e visualizar notícias' },
      { name: 'Categorias', description: 'Endpoints para listar categorias' },
      { name: 'Preferências', description: 'Endpoints para gerenciar preferências do usuário' },
      { name: 'Perfil', description: 'Endpoints para gerenciar perfil do usuário' },
    ],
  },
});

// Configuração do Swagger UI
await app.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

app.register(appRoutes);

await app.register(fastifyCors, {
  // Substitua 'http://localhost:3000' pela URL exata onde seu React está rodando
  // Se for apenas para desenvolvimento, você pode usar true ou '*' (não recomendado em prod)
  // Mas para segurança, é melhor definir a origem exata.
  origin: "http://localhost:5173", 
  
  // Se você estiver enviando cookies, cabeçalhos de autorização, etc.
  credentials: true, 

  // Métodos que seu frontend pode usar
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
});

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error.', issues: treeifyError(error) });
  }

  if(env.NODE_ENV !== 'prod') {
    console.error(error);
  } else {
    // TODO: Logs de erro em produção
  }

  return reply.status(500).send({ message: 'Internal Server Error.' });
});