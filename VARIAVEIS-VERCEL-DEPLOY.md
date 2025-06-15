# Variáveis de Ambiente para Vercel - Deploy Final

## Configure estas variáveis no painel do Vercel:

### 1. DATABASE_URL
```
postgresql://postgres:in2zXU2yiaXnYPrC@db.hkiipdrkjerwrsgvgofz.supabase.co:5432/postgres
```

### 2. NEXTAUTH_SECRET
```
k9kL/KlN+OpczcPVZIrDDISAo9lGxZ/H6MvaEniIvTQ=
```

### 3. NEXTAUTH_URL
```
https://superpixel-7kliyd36a-verges1212-projects.vercel.app
```

### 4. NEXT_PUBLIC_SUPABASE_URL
```
https://hkiipdrkjerwrsgvgofz.supabase.co
```

### 5. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWlwZHJramVyd3JzZ3Znb2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDY2MTIsImV4cCI6MjA2NTU4MjYxMn0.S64n2qIPEBRxyhsn7HAF1SX55BbXr5WgfJiduq2FVqY
```

## Como configurar:

1. Acesse: https://vercel.com/verges1212-projects/superpixel/settings/environment-variables
2. Adicione cada variável acima
3. Selecione "Production, Preview, Development" para todas
4. Clique em "Save"
5. Faça um novo deploy: `npx vercel --prod`

## URLs do Deploy:
- **Produção**: https://superpixel-7kliyd36a-verges1212-projects.vercel.app
- **Painel**: https://vercel.com/verges1212-projects/superpixel

## Login de Teste:
- **Email**: admin@superpixel.com
- **Senha**: admin123

## Status:
✅ **Supabase**: Funcionando (API REST testada com sucesso)
✅ **Deploy**: Realizado com sucesso
⚠️ **Problema**: SSO do Vercel bloqueando acesso
⚠️ **Conexão Local**: Prisma não consegue conectar (possível problema de rede/firewall) 