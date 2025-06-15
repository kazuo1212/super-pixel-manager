# 🚀 DEPLOY IMEDIATO - Guia Completo

## 📋 **PASSO 1: Configurar GitHub**

### 1.1 Criar Repositório no GitHub
1. Acesse: https://github.com/new
2. **Repository name**: `super-pixel-manager`
3. **Description**: `Sistema de gerenciamento de Super Pixels do Facebook`
4. Marque **Public** ou **Private** (sua escolha)
5. **NÃO** marque "Add a README file"
6. Clique em **"Create repository"**

### 1.2 Conectar Repositório Local
```bash
# No terminal, dentro da pasta do projeto:
git remote add origin https://github.com/SEU-USUARIO/super-pixel-manager.git
git branch -M main
git push -u origin main
```

---

## 📋 **PASSO 2: Configurar Supabase**

### 2.1 Criar Projeto Supabase
1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `super-pixel-manager`
   - **Database Password**: `mm273281`
   - **Region**: `South America (São Paulo)`
4. Clique em **"Create new project"**
5. **Aguarde 2-3 minutos** para provisionar

### 2.2 Executar Schema SQL
1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. **Cole TODO o conteúdo** do arquivo `supabase-schema.sql`
4. Clique em **"Run"** para executar
5. Verifique se apareceu: **"Success. No rows returned"**

### 2.3 Obter URL de Conexão
1. Vá em **Settings** → **Database**
2. Na seção **Connection string**, copie a **URI**
3. Substitua `[YOUR-PASSWORD]` por `mm273281`
4. **Exemplo**: `postgresql://postgres:mm273281@db.abcdefghijk.supabase.co:5432/postgres`

---

## 📋 **PASSO 3: Deploy na Vercel**

### 3.1 Importar Projeto
1. Acesse: https://vercel.com/dashboard
2. Clique em **"New Project"**
3. Clique em **"Import Git Repository"**
4. Selecione seu repositório `super-pixel-manager`
5. Clique em **"Import"**

### 3.2 Configurar Variáveis de Ambiente
**ANTES de fazer deploy**, clique em **"Environment Variables"** e adicione:

```env
DATABASE_URL
postgresql://postgres:mm273281@db.SEU-ID.supabase.co:5432/postgres

NEXTAUTH_SECRET
super-pixel-manager-secret-key-2024

NEXTAUTH_URL
https://SEU-PROJETO.vercel.app

SUPER_PIXEL_ENDPOINT
https://SEU-PROJETO.vercel.app/api/track
```

### 3.3 Fazer Deploy
1. Após configurar as variáveis, clique em **"Deploy"**
2. **Aguarde 2-3 minutos** para o build
3. Se der erro, verifique os logs e as variáveis

---

## 📋 **PASSO 4: Testar Funcionamento**

### 4.1 Acessar Aplicação
1. **URL**: https://seu-projeto.vercel.app
2. **Login**: admin@superpixel.com
3. **Senha**: admin123

### 4.2 Verificar Funcionalidades
- [ ] **Login** funcionando
- [ ] **Dashboard** carregando
- [ ] **Super Pixel MODARE** aparecendo
- [ ] **2 Pixels** configurados
- [ ] **Terminal de eventos** ativo
- [ ] **Estatísticas** mostrando dados

### 4.3 Testar API de Tracking
```bash
curl -X POST https://seu-projeto.vercel.app/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "superPixelId": "cmbxzg14k000frtbpic1trvsx",
    "eventName": "PageView",
    "eventData": {"value": 0},
    "page": {
      "url": "https://teste.com",
      "title": "Página de Teste"
    },
    "device": {
      "type": "desktop",
      "browser": "Chrome",
      "os": "Windows"
    }
  }'
```

---

## 🔧 **COMANDOS PRONTOS**

### Para GitHub (execute na pasta do projeto):
```bash
# Substituir SEU-USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU-USUARIO/super-pixel-manager.git
git branch -M main
git push -u origin main
```

### Para testar localmente com Supabase:
```bash
# Criar arquivo .env.local com:
DATABASE_URL="postgresql://postgres:mm273281@db.SEU-ID.supabase.co:5432/postgres"
NEXTAUTH_SECRET="super-pixel-manager-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
SUPER_PIXEL_ENDPOINT="http://localhost:3000/api/track"

# Depois executar:
npm install
npx prisma generate
npm run dev
```

---

## 🚨 **Solução de Problemas**

### Erro de Build na Vercel
1. **Verificar variáveis de ambiente** (todas configuradas?)
2. **Checar logs** na aba "Functions"
3. **Testar conexão** com Supabase

### Erro de Conexão com Supabase
1. **Verificar URL** de conexão
2. **Confirmar senha** (mm273281)
3. **Aguardar** projeto provisionar completamente

### Erro de Login
1. **Verificar** se schema foi executado
2. **Confirmar** usuário admin foi criado
3. **Testar** credenciais: admin@superpixel.com / admin123

---

## ✅ **CHECKLIST FINAL**

### GitHub
- [ ] Repositório criado
- [ ] Código enviado
- [ ] Commits atualizados

### Supabase
- [ ] Projeto criado
- [ ] Schema executado
- [ ] URL de conexão obtida
- [ ] Tabelas criadas
- [ ] Dados de exemplo inseridos

### Vercel
- [ ] Projeto importado
- [ ] Variáveis configuradas
- [ ] Deploy realizado
- [ ] Build bem-sucedido

### Funcionalidades
- [ ] Login funcionando
- [ ] Dashboard operacional
- [ ] Terminal de eventos ativo
- [ ] API de tracking respondendo
- [ ] Super Pixels gerenciáveis

---

## 🎉 **RESULTADO FINAL**

Após seguir todos os passos, você terá:

✅ **Sistema completo** rodando na Vercel
✅ **Banco PostgreSQL** no Supabase
✅ **Terminal minimalista** funcionando
✅ **API de tracking** ativa
✅ **Dashboard moderno** operacional
✅ **Gerenciamento completo** de pixels

**🌐 URL Final**: https://seu-projeto.vercel.app
**👤 Login**: admin@superpixel.com / admin123
**📊 Dashboard**: Estatísticas + Terminal ao vivo
**🔗 API**: /api/track para capturar eventos

---

## 📞 **Próximos Passos**

1. **Personalizar domínio** na Vercel (opcional)
2. **Configurar Facebook App** para Conversions API
3. **Adicionar mais Super Pixels** conforme necessário
4. **Monitorar eventos** no terminal em tempo real
5. **Integrar com sites** usando o script de tracking

**🚀 SEU SUPER PIXEL MANAGER ESTÁ PRONTO PARA USO!** 