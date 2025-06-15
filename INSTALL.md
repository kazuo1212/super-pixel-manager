# 🚀 Instalação Rápida - Super Pixel Manager

## Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (gratuita)

## Instalação em 4 passos

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto: `super-pixel-manager`
3. Settings → Database → Copie Connection String
4. Crie arquivo `.env` com:
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres"
NEXTAUTH_SECRET="uma_chave_secreta_muito_forte"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Configurar banco de dados e criar usuário admin
```bash
npm run setup
```

### 4. Iniciar o servidor
```bash
npm run dev
```

## 🎉 Pronto!

Acesse: **http://localhost:3000**

**Credenciais padrão:**
- Email: `admin@superpixel.com`
- Senha: `admin123`

⚠️ **Importante:** Altere a senha após o primeiro login!

## 📋 Próximos passos

1. **Faça login** com as credenciais acima
2. **Crie um Super Pixel** ou use o de exemplo
3. **Configure seus pixels** do Facebook
4. **Copie o código** de implementação
5. **Cole no `<head>`** das suas páginas
6. **Monitore os dados** no dashboard

## 🔧 Comandos úteis

```bash
# Resetar banco de dados
npm run reset

# Abrir Prisma Studio (visualizar dados)
npm run db:studio

# Build para produção
npm run build
```

## 🆘 Problemas?

1. Verifique se o Node.js 18+ está instalado
2. Delete `node_modules` e rode `npm install` novamente
3. Verifique se a porta 3000 está livre
4. Consulte o README.md para mais detalhes

---

**Desenvolvido com ❤️ para otimizar suas campanhas do Facebook** 