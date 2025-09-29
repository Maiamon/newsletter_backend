# Documentação da API - Swagger

Este projeto agora possui documentação completa da API usando Swagger/OpenAPI.

## Acessando a Documentação

Após iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse a documentação interativa em: **http://localhost:3333/docs**

## Funcionalidades da Documentação

### 📋 Seções Organizadas

A API está organizada em 5 seções principais:

1. **Autenticação** - Endpoints públicos para registro e login
2. **Notícias** - Busca e visualização de notícias (protegido)
3. **Categorias** - Listagem de categorias disponíveis (protegido)
4. **Preferências** - Gerenciamento de preferências do usuário (protegido)
5. **Perfil** - Gerenciamento do perfil do usuário (protegido)

### 🔐 Autenticação no Swagger UI

Para testar as rotas protegidas:

1. Primeiro, faça login usando o endpoint `POST /auth/login`
2. Copie o token JWT retornado
3. Clique no botão **"Authorize"** no topo da página
4. Cole o token no formato: `Bearer SEU_TOKEN_AQUI`
5. Clique em "Authorize"
6. Agora você pode testar todas as rotas protegidas!

### 📝 Endpoints Disponíveis

#### Autenticação (Públicos)
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login e obter token JWT

#### Notícias (Protegidos)
- `GET /news` - Buscar notícias com filtros (página, limite, período, categoria)
- `GET /news/{id}` - Obter detalhes de uma notícia específica

#### Categorias (Protegidos)
- `GET /categories` - Listar todas as categorias disponíveis

#### Preferências (Protegidos)
- `GET /preferences` - Listar categorias disponíveis para preferências
- `GET /users/me/preferences` - Obter preferências do usuário atual
- `PUT /users/me/preferences` - Atualizar preferências do usuário

#### Perfil (Protegidos)
- `GET /user/profile` - Obter perfil completo do usuário
- `PUT /user/profile` - Atualizar nome do usuário

### 🛠️ Testando a API

O Swagger UI permite:
- ✅ Executar requests diretamente da interface
- ✅ Ver exemplos de request/response
- ✅ Validar dados de entrada
- ✅ Testar diferentes cenários de erro
- ✅ Autenticação integrada para rotas protegidas

### 📊 Schemas de Dados

Todos os schemas de entrada e saída estão documentados, incluindo:
- Tipos de dados esperados
- Campos obrigatórios
- Validações (tamanhos mínimos/máximos, formatos)
- Descrições detalhadas de cada campo

### 🔧 Configuração Técnica

A documentação foi implementada usando:
- `@fastify/swagger` - Geração da especificação OpenAPI
- `@fastify/swagger-ui` - Interface web interativa
- Schemas inline nas rotas para validação automática
- Configuração de segurança Bearer Token

## Exemplo de Uso

1. **Registrar usuário:**
   ```bash
   POST /auth/register
   {
     "name": "João Silva",
     "email": "joao@email.com", 
     "password": "minhasenha123"
   }
   ```

2. **Fazer login:**
   ```bash
   POST /auth/login
   {
     "email": "joao@email.com",
     "password": "minhasenha123"
   }
   ```

3. **Usar token nas rotas protegidas:**
   ```bash
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

**💡 Dica:** Mantenha a aba da documentação aberta durante o desenvolvimento para facilitar os testes da API!