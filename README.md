# newsletter_backend
O backend de um Newsletter inteligente


# Desafio

## Essencial

## EXTRAS

## Decisões

//TODO: Explicar o pq usei SQL e especialmente o postgres

- Criei o projeto usando Nodejs por familiaridade, escolhi não usar o NestJs, visto que ele já traz muitas soluções prontas, preferi fazer algo mais simples com o Fastify, e ir criando meus design patterns e organizando o código conforme o projeto iria crescendo.

- Escolhi usar o Prisma como ORM para facilitar a integração com o banco de dados, criação de modelos, migrações e seeders.

- Para criação do JWT usei a biblioteca jose, visto que diferentemente da lib jsonwebtoken, a jose não tem dependencias, além de ser mais frequentimente atualizada e melhor mantida.

- Similarmente decidi usar a biblioteca bcryptjs ao invés da bcrypt, por não ter dependencias de pacotes.

- Usei padrões SOLID, Use Case, in memory test

### Backend que serve as notícias

## API Endpoints

### Autenticação (Públicas)
- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login de usuário (retorna JWT)

### Notícias (Protegidas - requer JWT)
- `GET /news` - Buscar notícias com paginação e filtros
- `GET /news/:id` - Obter detalhes de uma notícia específica

### Categorias (Protegidas - requer JWT)
- `GET /categories` - Buscar todas as categorias disponíveis

### Autenticação JWT
Todas as rotas protegidas requerem o header:
```
Authorization: Bearer <seu_jwt_token>
```

### COMANDOS

npm run dev # rodar a aplicação
npm run test # executar testes
npm run build # build para produção

npx prisma studio # interface visual do banco
npx prisma migrate dev # aplicar migrações
npx prisma generate # gerar cliente Prisma
npx prisma db seed # popular banco com dados de teste
npx prisma migrate reset # reset completo do banco

docker compose up -d # subir banco PostgreSQL