# 🎯 Configuração do SEU Projeto Supabase

## ✅ Projeto Criado com Sucesso!

**URL do Projeto**: https://hkiipdrkjerwrsgvgofz.supabase.co

## 🔧 Configuração Local

### 1. Criar arquivo .env

Crie o arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# SUBSTITUA [YOUR-PASSWORD] pela senha que você criou no Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.hkiipdrkjerwrsgvgofz.supabase.co:5432/postgres"

# NextAuth (usando JWT Secret do Supabase)
NEXTAUTH_SECRET="L9sA7BC++zBmcv02tvA6iGalp+/cmhRr2nKUVUnv2W+AaoWqc+xpNcfrAV+R5sieU4C9Yv8ClyWJ6AwxsTlxqg=="
NEXTAUTH_URL="http://localhost:3000"

# Supabase Config (opcional)
SUPABASE_URL="https://hkiipdrkjerwrsgvgofz.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWlwZHJramVyd3JzZ3Znb2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDY2MTIsImV4cCI6MjA2NTU4MjYxMn0.S64n2qIPEBRxyhsn7HAF1SX55BbXr5WgfJiduq2FVqY"
```

### 2. Comandos para Executar

```bash
# 1. Aplicar schema no Supabase
npx prisma db push

# 2. Gerar cliente Prisma
npx prisma generate

# 3. Executar setup inicial (criar admin e dados de exemplo)
npm run setup

# 4. Iniciar servidor
npm run dev
```

### 3. Verificar no Dashboard Supabase

1. **Acesse**: https://hkiipdrkjerwrsgvgofz.supabase.co
2. **Vá em**: Table Editor (menu lateral)
3. **Verifique** se as tabelas foram criadas:
   - User
   - SuperPixel
   - Pixel
   - Event
   - Account
   - Session
   - VerificationToken

## 🚀 Para Deploy na Vercel

### Environment Variables na Vercel:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@db.hkiipdrkjerwrsgvgofz.supabase.co:5432/postgres
NEXTAUTH_SECRET=L9sA7BC++zBmcv02tvA6iGalp+/cmhRr2nKUVUnv2W+AaoWqc+xpNcfrAV+R5sieU4C9Yv8ClyWJ6AwxsTlxqg==
NEXTAUTH_URL=https://seu-app.vercel.app
```

### Após Deploy:

Faça POST para inicializar o banco:
```bash
curl -X POST https://seu-app.vercel.app/api/setup
```

## 🎯 Credenciais Padrão

Após executar `npm run setup`:

- **Email**: admin@superpixel.com
- **Senha**: admin123

## 📊 Monitoramento

**Dashboard Supabase**: https://hkiipdrkjerwrsgvgofz.supabase.co

### Queries Úteis no SQL Editor:

```sql
-- Ver usuários
SELECT * FROM "User";

-- Ver Super Pixels
SELECT * FROM "SuperPixel";

-- Ver eventos capturados (últimos 10)
SELECT * FROM "Event" ORDER BY "createdAt" DESC LIMIT 10;

-- Estatísticas
SELECT 
  COUNT(*) as total_events,
  COUNT(DISTINCT "superPixelId") as active_pixels
FROM "Event";
```

## ✅ Tudo Pronto!

Seu Super Pixel Manager está configurado com Supabase!

**Próximos passos:**
1. ✅ Configurar .env local
2. ✅ Executar setup
3. ✅ Testar localmente
4. 🚀 Deploy na Vercel
5. 🎯 Configurar pixels do Facebook 