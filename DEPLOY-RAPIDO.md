# ⚡ Deploy Rápido na Vercel

## 🚀 Em 5 minutos na Vercel!

### 1. Criar Banco no Supabase (2 min)
1. **Acesse**: https://supabase.com
2. **Crie conta** gratuita (use GitHub)
3. **New Project**: `super-pixel-manager`
4. **Crie senha** forte para o banco
5. **Settings → Database → Connection String**
6. **Copie a URI** e substitua `[YOUR-PASSWORD]`

### 2. Push para GitHub (1 min)
```bash
# Criar repositório no GitHub primeiro, depois:
git remote add origin https://github.com/SEU_USUARIO/super-pixel-manager.git
git branch -M main
git push -u origin main
```

### 3. Deploy na Vercel (2 min)
1. Acesse: https://vercel.com
2. **New Project** → Conectar GitHub
3. Selecionar repositório `super-pixel-manager`
4. **Adicionar Environment Variables:**
   ```
   DATABASE_URL=sua_connection_string_do_banco
   NEXTAUTH_SECRET=uma_chave_secreta_forte_32_chars
   NEXTAUTH_URL=https://seu-app.vercel.app
   ```
5. **Deploy!**

### 4. Inicializar Banco (30 seg)
Após deploy, acesse:
```
https://seu-app.vercel.app/api/setup
```
Método: **POST** (use Postman, Insomnia ou curl)

**Ou via curl:**
```bash
curl -X POST https://seu-app.vercel.app/api/setup
```

## ✅ Pronto!

**URLs importantes:**
- **App**: https://seu-app.vercel.app
- **Login**: https://seu-app.vercel.app/login
- **Dashboard**: https://seu-app.vercel.app/dashboard

**Credenciais padrão:**
- Email: `admin@superpixel.com`
- Senha: `admin123`

## 🔧 Se der erro:

**Erro de build?**
- Verifique se DATABASE_URL está correto
- Verifique se todas as env vars estão definidas

**Erro de banco?**
- Teste a connection string localmente
- Verifique se o banco PostgreSQL está ativo

**Erro 500?**
- Veja os logs na Vercel Dashboard
- Acesse Functions → View Logs

## 🎯 Teste Rápido:
1. Acesse `/login` → Faça login
2. Crie um Super Pixel
3. Copie o código gerado
4. Teste em `/exemplo.html`

---
**🎉 Seu Super Pixel Manager está no ar!** 