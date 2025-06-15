# 🚀 GUIA COMPLETO: CONFIGURAR SUPABASE

## ✅ **SISTEMA JÁ FUNCIONANDO**

O Super Pixel Manager está **100% funcional** com SQLite:
- 🌐 **Local**: http://localhost:3000
- 🌐 **Online**: https://super-pixel-manager.vercel.app
- 👤 **Login**: admin@superpixel.com / admin123

---

## 🔄 **MIGRAR PARA SUPABASE (OPCIONAL)**

### **PASSO 1: Obter Credenciais Corretas**

1. Acesse: https://supabase.com/dashboard/project/hkiipdrkjerwrsgvgofz
2. Vá em **Settings** → **API**
3. Copie as chaves:
   - **URL**: `https://hkiipdrkjerwrsgvgofz.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **PASSO 2: Executar SQL no Supabase**

1. Vá em **SQL Editor** no dashboard
2. Clique em **New query**
3. Cole todo o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **Run** (Ctrl+Enter)

### **PASSO 3: Configurar Variáveis de Ambiente**

Edite o arquivo `.env` e substitua por:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:mm273281@db.hkiipdrkjerwrsgvgofz.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="super-pixel-secret-key-2024-production"
NEXTAUTH_URL="http://localhost:3000"

# Supabase Configuration
SUPABASE_URL="https://hkiipdrkjerwrsgvgofz.supabase.co"
SUPABASE_ANON_KEY="SUA_ANON_KEY_AQUI"
SUPABASE_SERVICE_ROLE_KEY="SUA_SERVICE_ROLE_KEY_AQUI"
```

### **PASSO 4: Atualizar Schema do Prisma**

Edite `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### **PASSO 5: Aplicar Mudanças**

```bash
npx prisma db push
npm run dev
```

---

## 🔧 **ALTERNATIVAS SE SUPABASE NÃO FUNCIONAR**

### **Opção 1: Neon (Recomendado)**
```bash
# 1. Crie conta em: https://neon.tech
# 2. Crie um projeto
# 3. Copie a connection string
# 4. Substitua no .env:
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb"
```

### **Opção 2: Railway**
```bash
# 1. Crie conta em: https://railway.app
# 2. Adicione PostgreSQL
# 3. Copie a connection string
# 4. Substitua no .env
```

### **Opção 3: Continuar com SQLite**
```bash
# Já está funcionando perfeitamente!
# Ideal para desenvolvimento e testes
DATABASE_URL="file:./dev.db"
```

---

## 🎯 **RESUMO DO STATUS**

### ✅ **FUNCIONANDO AGORA:**
- ✅ Sistema completo rodando
- ✅ Banco SQLite configurado
- ✅ Usuário admin criado
- ✅ Interface moderna funcionando
- ✅ Super Pixel script operacional
- ✅ Tracking de eventos ativo

### 🔄 **OPCIONAL (Supabase):**
- 🔄 Migração para PostgreSQL
- 🔄 Banco na nuvem
- 🔄 Escalabilidade maior

---

## 📞 **SUPORTE**

Se tiver problemas com Supabase:
1. **Primeiro**: Continue usando SQLite (já funciona!)
2. **Segundo**: Tente Neon ou Railway
3. **Terceiro**: Me chame para ajudar

## 🎉 **PARABÉNS!**

Seu Super Pixel Manager está **100% funcional**!
- 🌐 Acesse: http://localhost:3000
- 👤 Login: admin@superpixel.com / admin123 