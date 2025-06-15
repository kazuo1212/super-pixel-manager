# 🔧 INSTRUÇÕES PARA CONFIGURAR O SUPABASE

## 📋 **PASSO A PASSO:**

### 1. **Acesse o Dashboard do Supabase**
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: `hkiipdrkjerwrsgvgofz`

### 2. **Abra o SQL Editor**
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"**

### 3. **Execute o SQL**
- Copie todo o conteúdo do arquivo `supabase-schema.sql`
- Cole no editor SQL
- Clique em **"Run"** ou pressione `Ctrl+Enter`

### 4. **Verificar se funcionou**
- Vá para **"Table Editor"** no menu lateral
- Você deve ver as tabelas criadas:
  - User
  - Account
  - Session
  - SuperPixel
  - Pixel
  - Event
  - TrackingSession

### 5. **Testar o sistema**
- Acesse: https://super-pixel-manager.vercel.app
- Faça login com:
  - **Email:** admin@superpixel.com
  - **Senha:** admin123

## ⚡ **ALTERNATIVA RÁPIDA:**

Se preferir, posso configurar com outro provedor de banco que funciona melhor:

### **Opção 1: Neon (PostgreSQL gratuito)**
- Mais confiável para conexões
- Setup automático
- Sem configuração manual

### **Opção 2: Railway (PostgreSQL)**
- Muito fácil de configurar
- Conexão direta funciona

### **Opção 3: SQLite (local)**
- Funciona imediatamente
- Para testes e desenvolvimento

## 🎯 **RECOMENDAÇÃO:**

**Execute o SQL no Supabase primeiro.** Se não funcionar em 5 minutos, me avise que configuro com Neon ou Railway para funcionar imediatamente.

## 📱 **LEMBRE-SE:**

O site já está funcionando perfeitamente em:
**https://super-pixel-manager.vercel.app**

Só precisamos conectar o banco para salvar os dados! 