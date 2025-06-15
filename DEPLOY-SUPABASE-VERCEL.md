# 🚀 Deploy Completo: Supabase + Vercel

## 📋 **PASSO A PASSO COMPLETO**

### 1. 🗄️ **Configurar Supabase**

#### 1.1 Criar Projeto Supabase
1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `super-pixel-manager`
   - **Database Password**: `mm273281` (ou sua preferência)
   - **Region**: `South America (São Paulo)`
4. Clique em **"Create new project"**
5. Aguarde 2-3 minutos para provisionar

#### 1.2 Executar Schema SQL
1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Cole o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **"Run"** para executar
5. Verifique se todas as tabelas foram criadas

#### 1.3 Obter URL de Conexão
1. Vá em **Settings** → **Database**
2. Na seção **Connection string**, copie a **URI**
3. Substitua `[YOUR-PASSWORD]` pela senha definida
4. Exemplo: `postgresql://postgres:mm273281@db.xxx.supabase.co:5432/postgres`

---

### 2. 🌐 **Deploy na Vercel**

#### 2.1 Preparar Repositório
```bash
# Adicionar arquivos ao git
git add .
git commit -m "Configuração para deploy com Supabase"
git push origin main
```

#### 2.2 Deploy na Vercel
1. Acesse: https://vercel.com/dashboard
2. Clique em **"New Project"**
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente:

```env
DATABASE_URL=postgresql://postgres:mm273281@db.xxx.supabase.co:5432/postgres
NEXTAUTH_SECRET=super-pixel-manager-secret-key-2024
NEXTAUTH_URL=https://seu-projeto.vercel.app
SUPER_PIXEL_ENDPOINT=https://seu-projeto.vercel.app/api/track
```

5. Clique em **"Deploy"**

---

### 3. ⚙️ **Variáveis de Ambiente**

#### 3.1 Para Desenvolvimento Local
Crie arquivo `.env.local`:
```env
DATABASE_URL="postgresql://postgres:mm273281@db.xxx.supabase.co:5432/postgres"
NEXTAUTH_SECRET="super-pixel-manager-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
SUPER_PIXEL_ENDPOINT="http://localhost:3000/api/track"
```

#### 3.2 Para Produção (Vercel)
Configure no dashboard da Vercel:
- `DATABASE_URL`: URL do PostgreSQL do Supabase
- `NEXTAUTH_SECRET`: Chave secreta para NextAuth
- `NEXTAUTH_URL`: URL do seu app na Vercel
- `SUPER_PIXEL_ENDPOINT`: Endpoint de tracking

---

### 4. 🧪 **Testar Deploy**

#### 4.1 Verificar Funcionalidades
1. **Login**: admin@superpixel.com / admin123
2. **Dashboard**: Estatísticas e terminal
3. **Super Pixels**: Criar, editar, deletar
4. **Pixels**: Adicionar, gerenciar
5. **Terminal**: Eventos em tempo real
6. **Tracking**: Script funcionando

#### 4.2 Testar API de Tracking
```bash
curl -X POST https://seu-projeto.vercel.app/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "superPixelId": "ID_DO_SUPER_PIXEL",
    "eventName": "PageView",
    "eventData": {"value": 0},
    "page": {
      "url": "https://teste.com",
      "title": "Teste"
    },
    "device": {
      "type": "desktop",
      "browser": "Chrome",
      "os": "Windows"
    }
  }'
```

---

### 5. 🔧 **Comandos Úteis**

#### 5.1 Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Executar em desenvolvimento
npm run dev
```

#### 5.2 Deploy Manual
```bash
# Build para produção
npm run build

# Fazer push do schema
npx prisma db push

# Deploy na Vercel
vercel --prod
```

---

### 6. 📊 **Monitoramento**

#### 6.1 Logs da Vercel
- Acesse o dashboard da Vercel
- Vá em **Functions** → **View Function Logs**
- Monitore erros e performance

#### 6.2 Logs do Supabase
- Dashboard do Supabase → **Logs**
- Monitore queries e conexões
- Verifique performance do banco

---

### 7. 🚨 **Solução de Problemas**

#### 7.1 Erro de Conexão com Banco
```bash
# Testar conexão
npx prisma db push
```

#### 7.2 Erro de Build na Vercel
- Verificar variáveis de ambiente
- Checar logs de build
- Validar sintaxe do código

#### 7.3 Erro de NextAuth
- Verificar NEXTAUTH_SECRET
- Confirmar NEXTAUTH_URL
- Checar configuração de domínio

---

### 8. 🎯 **URLs Importantes**

#### 8.1 Desenvolvimento
- **App**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **API**: http://localhost:3000/api/track

#### 8.2 Produção
- **App**: https://seu-projeto.vercel.app
- **Dashboard**: https://seu-projeto.vercel.app/dashboard
- **API**: https://seu-projeto.vercel.app/api/track

---

### 9. ✅ **Checklist Final**

#### 9.1 Supabase
- [ ] Projeto criado
- [ ] Schema executado
- [ ] Tabelas criadas
- [ ] Usuário admin inserido
- [ ] URL de conexão obtida

#### 9.2 Vercel
- [ ] Projeto importado
- [ ] Variáveis configuradas
- [ ] Deploy realizado
- [ ] Build bem-sucedido
- [ ] App funcionando

#### 9.3 Funcionalidades
- [ ] Login funcionando
- [ ] Dashboard carregando
- [ ] Super Pixels criados
- [ ] Terminal de eventos ativo
- [ ] API de tracking respondendo

---

## 🎉 **DEPLOY COMPLETO!**

Após seguir todos os passos, seu **Super Pixel Manager** estará:

✅ **Rodando na Vercel** com domínio personalizado
✅ **Conectado ao Supabase** PostgreSQL
✅ **Terminal de eventos** funcionando
✅ **API de tracking** ativa
✅ **Dashboard completo** operacional

**URL Final**: https://seu-projeto.vercel.app
**Login**: admin@superpixel.com / admin123 