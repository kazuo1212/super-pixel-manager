# ⚡ Supabase em 3 Minutos

## 🎯 Configuração Express

### 1. Criar Projeto Supabase (1 min)
```
1. https://supabase.com → Login com GitHub
2. New Project → Nome: super-pixel-manager
3. Senha forte → Create project
4. Aguardar 2 min (criação automática)
```

### 2. Pegar Connection String (30 seg)
```
1. Settings (engrenagem) → Database
2. Connection string → URI
3. Copiar: postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
4. Substituir [YOUR-PASSWORD] pela sua senha
```

### 3. Configurar Localmente (1 min)
```bash
# Criar .env
echo 'DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres"
NEXTAUTH_SECRET="super-pixel-secret-key-forte-32-chars"
NEXTAUTH_URL="http://localhost:3000"' > .env

# Setup completo
npm run setup

# Iniciar
npm run dev
```

### 4. Verificar (30 seg)
```
✅ http://localhost:3000 → Login: admin@superpixel.com / admin123
✅ Supabase Dashboard → Table Editor → Ver tabelas criadas
✅ Criar Super Pixel → Testar funcionalidades
```

## 🚀 Deploy Vercel
```bash
# 1. Push GitHub
git remote add origin https://github.com/SEU_USER/super-pixel-manager.git
git push -u origin main

# 2. Vercel.com → New Project → Conectar repo
# 3. Environment Variables:
#    DATABASE_URL=sua_connection_string_supabase
#    NEXTAUTH_SECRET=chave_forte_32_chars
#    NEXTAUTH_URL=https://seu-app.vercel.app

# 4. Deploy → POST https://seu-app.vercel.app/api/setup
```

## ✅ Pronto!
**Local**: http://localhost:3000  
**Produção**: https://seu-app.vercel.app  
**Supabase**: Dashboard para ver dados em tempo real

---
**💡 Vantagem**: Interface visual do Supabase para monitorar eventos! 