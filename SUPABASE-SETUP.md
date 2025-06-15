# 🚀 Configuração Supabase - Super Pixel Manager

## 📋 Passo a Passo Completo

### 1. Criar Conta no Supabase (2 min)

1. **Acesse**: https://supabase.com
2. **Clique em**: "Start your project"
3. **Faça login** com GitHub (recomendado) ou email
4. **Aceite** os termos de uso

### 2. Criar Novo Projeto (1 min)

1. **Clique em**: "New Project"
2. **Preencha**:
   - **Name**: `super-pixel-manager`
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha mais próxima (ex: South America)
   - **Pricing Plan**: Free (0$/mês)
3. **Clique em**: "Create new project"
4. **Aguarde** ~2 minutos (criação do banco)

### 3. Obter Connection String (30 seg)

1. **No dashboard do projeto**, vá em:
   - **Settings** (ícone de engrenagem)
   - **Database** (menu lateral)
2. **Role até**: "Connection string"
3. **Selecione**: "URI" 
4. **Copie** a string que aparece (algo como):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. **Substitua** `[YOUR-PASSWORD]` pela senha que você criou

### 4. Configurar Localmente (1 min)

Crie o arquivo `.env` na raiz do projeto:

```bash
# Criar arquivo .env
touch .env
```

Adicione no arquivo `.env`:
```env
# Supabase Database
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="uma_chave_secreta_muito_forte_de_32_caracteres_ou_mais"
NEXTAUTH_URL="http://localhost:3000"

# Facebook API (opcional)
FACEBOOK_APP_ID=""
FACEBOOK_APP_SECRET=""
```

### 5. Testar Conexão (1 min)

```bash
# Instalar dependências (se ainda não fez)
npm install

# Aplicar schema no Supabase
npx prisma db push

# Gerar cliente Prisma
npx prisma generate

# Executar setup inicial
npm run setup
```

### 6. Verificar no Supabase (30 seg)

1. **Volte ao dashboard** do Supabase
2. **Clique em**: "Table Editor" (menu lateral)
3. **Verifique** se as tabelas foram criadas:
   - User
   - SuperPixel  
   - Pixel
   - Event
   - Account
   - Session
   - VerificationToken

### 7. Testar Aplicação (1 min)

```bash
# Iniciar servidor
npm run dev
```

1. **Acesse**: http://localhost:3000
2. **Faça login** com:
   - Email: `admin@superpixel.com`
   - Senha: `admin123`
3. **Verifique** se o dashboard carrega

## 🎯 Para Deploy na Vercel

### Environment Variables na Vercel:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres
NEXTAUTH_SECRET=uma_chave_secreta_muito_forte_de_32_caracteres_ou_mais
NEXTAUTH_URL=https://seu-app.vercel.app
```

### Após Deploy na Vercel:

1. **Inicializar banco** fazendo POST para:
   ```
   https://seu-app.vercel.app/api/setup
   ```

2. **Ou via curl**:
   ```bash
   curl -X POST https://seu-app.vercel.app/api/setup
   ```

## 🔧 Vantagens do Supabase

✅ **Gratuito**: 500MB de banco, 2GB de bandwidth  
✅ **Interface Visual**: Gerenciar dados via dashboard  
✅ **Backups Automáticos**: Seus dados estão seguros  
✅ **APIs Prontas**: REST e GraphQL automáticas  
✅ **Realtime**: Atualizações em tempo real  
✅ **Auth Integrada**: Sistema de autenticação pronto  

## 📊 Monitoramento

### Dashboard do Supabase:
- **Database**: Ver tabelas e dados
- **Auth**: Gerenciar usuários  
- **Storage**: Arquivos (se usar)
- **Edge Functions**: Funções serverless
- **Logs**: Logs de queries e erros

### Queries Úteis:
```sql
-- Ver todos os usuários
SELECT * FROM "User";

-- Ver Super Pixels
SELECT * FROM "SuperPixel";

-- Ver eventos capturados
SELECT * FROM "Event" ORDER BY "createdAt" DESC LIMIT 10;

-- Estatísticas
SELECT 
  COUNT(*) as total_events,
  COUNT(DISTINCT "superPixelId") as active_pixels
FROM "Event";
```

## 🚨 Troubleshooting

### Erro de Conexão:
- Verifique se a senha está correta na connection string
- Confirme se o projeto Supabase está ativo
- Teste a conexão com: `npx prisma db push`

### Erro de Schema:
- Execute: `npx prisma db push --force-reset` (cuidado: apaga dados!)
- Verifique se não há conflitos de nomes

### Erro de Permissões:
- No Supabase, vá em Authentication > Policies
- Desabilite RLS temporariamente para testes

## 🎉 Pronto!

Seu Super Pixel Manager está agora conectado ao Supabase!

**Próximos passos:**
1. ✅ Banco configurado
2. 🚀 Deploy na Vercel  
3. 🎯 Configurar pixels do Facebook
4. 📊 Monitorar dados capturados

---

**💡 Dica**: Use o dashboard do Supabase para monitorar os eventos capturados em tempo real! 