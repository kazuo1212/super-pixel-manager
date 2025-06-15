# 🚀 Deploy na Vercel - Super Pixel Manager

## Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Conta no [GitHub](https://github.com) (para conectar o repositório)
- Banco PostgreSQL (recomendado: [Neon](https://neon.tech) ou [Supabase](https://supabase.com))

## 📋 Passo a Passo

### 1. Preparar o Banco de Dados

#### Opção A: Neon (Recomendado - Gratuito)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a **Connection String** (DATABASE_URL)

#### Opção B: Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e novo projeto
3. Vá em **Settings > Database**
4. Copie a **Connection String**

### 2. Fazer Push do Código para GitHub

```bash
# Inicializar repositório Git (se ainda não fez)
git init
git add .
git commit -m "Initial commit - Super Pixel Manager"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/SEU_USUARIO/super-pixel-manager.git
git branch -M main
git push -u origin main
```

### 3. Deploy na Vercel

#### Via Dashboard da Vercel:
1. Acesse [vercel.com](https://vercel.com)
2. Faça login e clique em **"New Project"**
3. Conecte sua conta do GitHub
4. Selecione o repositório `super-pixel-manager`
5. Configure as variáveis de ambiente (próximo passo)
6. Clique em **"Deploy"**

#### Via CLI da Vercel:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

### 4. Configurar Variáveis de Ambiente

Na dashboard da Vercel, vá em **Settings > Environment Variables** e adicione:

```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host/seu_banco
NEXTAUTH_SECRET=uma_chave_secreta_muito_forte_aqui
NEXTAUTH_URL=https://seu-app.vercel.app
```

**⚠️ Importante:**
- `DATABASE_URL`: Use a connection string do seu banco PostgreSQL
- `NEXTAUTH_SECRET`: Gere uma chave forte (pode usar: `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Será a URL final do seu app na Vercel

### 5. Configurar Banco de Dados em Produção

Após o deploy, você precisa executar as migrations:

#### Opção A: Via Vercel CLI
```bash
# Conectar ao projeto
vercel link

# Executar comando no ambiente de produção
vercel env pull .env.local
npx prisma db push
```

#### Opção B: Via Script Personalizado
Crie um endpoint temporário para inicializar o banco:

1. Acesse: `https://seu-app.vercel.app/api/setup` (se criar o endpoint)
2. Ou use o Prisma Studio online

### 6. Verificar Deploy

1. **Teste o login**: `https://seu-app.vercel.app/login`
2. **Verifique o dashboard**: `https://seu-app.vercel.app/dashboard`
3. **Teste o Super Pixel**: `https://seu-app.vercel.app/exemplo.html`

## 🔧 Configurações Adicionais

### Custom Domain (Opcional)
1. Na Vercel, vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

### Monitoramento
1. **Analytics**: Habilitado automaticamente na Vercel
2. **Logs**: Acesse via dashboard da Vercel
3. **Performance**: Monitore via Vercel Speed Insights

## 🚨 Troubleshooting

### Erro de Build
```bash
# Se der erro no build, verifique:
1. Se todas as dependências estão no package.json
2. Se o DATABASE_URL está correto
3. Se o Prisma está gerando o client corretamente
```

### Erro de Banco de Dados
```bash
# Verificar conexão
npx prisma db push --preview-feature

# Reset do banco (cuidado em produção!)
npx prisma migrate reset
```

### Erro de Autenticação
```bash
# Verificar se NEXTAUTH_SECRET está definido
# Verificar se NEXTAUTH_URL está correto
```

## 📊 Monitoramento Pós-Deploy

### 1. Verificar Logs
```bash
# Via CLI
vercel logs

# Via Dashboard
# Acesse Functions > View Function Logs
```

### 2. Testar Funcionalidades
- [ ] Login/Registro funcionando
- [ ] Criação de Super Pixels
- [ ] Geração de código
- [ ] Captura de eventos
- [ ] API endpoints respondendo

### 3. Performance
- [ ] Tempo de carregamento < 3s
- [ ] APIs respondendo < 1s
- [ ] Super Pixel script carregando

## 🔐 Segurança em Produção

### Variáveis de Ambiente Seguras
```env
# Use valores fortes em produção
NEXTAUTH_SECRET=chave_muito_forte_de_32_caracteres_ou_mais
DATABASE_URL=postgresql://user:senha_forte@host/db
```

### CORS e Headers
O Next.js já configura headers de segurança automaticamente.

### Rate Limiting
Considere implementar rate limiting para as APIs em produção.

## 🎯 URLs Importantes

Após o deploy, você terá:

- **App Principal**: `https://seu-app.vercel.app`
- **Login**: `https://seu-app.vercel.app/login`
- **Dashboard**: `https://seu-app.vercel.app/dashboard`
- **API**: `https://seu-app.vercel.app/api/*`
- **Super Pixel Script**: `https://seu-app.vercel.app/super-pixel.js`
- **Página de Teste**: `https://seu-app.vercel.app/exemplo.html`

## 🎉 Pronto!

Seu Super Pixel Manager está agora rodando em produção na Vercel!

### Próximos Passos:
1. **Configure seus pixels** do Facebook
2. **Teste em páginas reais**
3. **Monitore os dados** capturados
4. **Otimize conforme necessário**

---

**💡 Dica**: Mantenha sempre backups do seu banco de dados e monitore os logs regularmente. 