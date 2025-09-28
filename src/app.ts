import fastify from "fastify";
import fastifyCors from '@fastify/cors';
import { appRoutes } from "#http/routes.ts";
import { treeifyError, ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

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