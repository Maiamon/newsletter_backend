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



### COMANDOS

npm run dev #rodar a aplicação

npx prisma studio

docker compose up -d

npx prisma migrate

npx prisma generate

npx prisma db seed

npx prisma migrate reset