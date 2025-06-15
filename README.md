# Super Pixel Manager

Um sistema completo para gerenciar pixels do Facebook de forma inteligente, capturando o máximo de dados possível para otimizar suas campanhas de anúncios.

## 🚀 Funcionalidades

- **Dashboard Moderno**: Interface minimalista usando Radix UI
- **Super Pixels**: Agrupe múltiplos pixels do Facebook em um só lugar
- **Captura Avançada de Dados**: Coleta automaticamente dados de:
  - Informações do dispositivo e navegador
  - Dados de UTM e parâmetros de campanha
  - Informações de e-commerce (preços, produtos)
  - Métricas de engajamento (scroll, tempo na página, cliques)
  - Dados de performance da página
  - Interações com formulários

- **Integração com Facebook**: 
  - Pixel do Facebook (client-side)
  - Conversions API (server-side)
  - Mapeamento automático de eventos

- **Monitoramento em Tempo Real**: Acompanhe todos os eventos capturados
- **Múltiplos Pixels**: Configure vários pixels por Super Pixel

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd super-pixel-manager
npm install
```

2. **Configure o Supabase**
   - Acesse [supabase.com](https://supabase.com)
   - Crie novo projeto: `super-pixel-manager`
   - Vá em Settings → Database
   - Copie a Connection String (URI)

3. **Configure variáveis de ambiente**
```bash
# Crie o arquivo .env
touch .env

# Adicione no .env:
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres"
NEXTAUTH_SECRET="uma_chave_secreta_muito_forte"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Configure o banco e inicie**
```bash
npm run setup
npm run dev
```

5. **Acesse:** http://localhost:3000

📖 **Guia detalhado**: Veja `SUPABASE-SETUP.md` para instruções completas

## 📋 Como Usar

### 1. Criar uma Conta
- Acesse `/register` para criar sua conta
- Faça login em `/login`

### 2. Criar um Super Pixel
- No dashboard, clique em "Criar Super Pixel"
- Dê um nome e descrição
- Configure os pixels do Facebook associados

### 3. Configurar Pixels do Facebook
- Adicione o ID do pixel do Facebook
- Configure o token de acesso para a Conversions API
- Ative/desative conforme necessário

### 4. Implementar o Script
Adicione este código no `<head>` da sua página:

```html
<!-- Configuração do Super Pixel -->
<script>
  window.SUPER_PIXEL_ID = 'seu-super-pixel-id-aqui';
  window.SUPER_PIXEL_DEBUG = true; // Remover em produção
</script>

<!-- Script do Super Pixel -->
<script src="https://seu-dominio.com/super-pixel.js" async></script>

<!-- Pixel do Facebook (opcional, mas recomendado) -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  fbq('init', 'SEU_PIXEL_ID_DO_FACEBOOK');
  fbq('track', 'PageView');
</script>
```

### 5. Eventos Personalizados
Você pode enviar eventos personalizados usando:

```javascript
// Evento simples
SuperPixel.track('custom_event', {
  category: 'engagement',
  action: 'button_click'
});

// Evento de compra
SuperPixel.track('purchase', {
  value: 99.90,
  currency: 'BRL',
  product_name: 'Produto Exemplo'
});
```

## 📊 Dados Capturados Automaticamente

O Super Pixel captura automaticamente:

### Informações do Dispositivo
- User Agent
- Idioma do navegador
- Plataforma
- Resolução da tela
- Tamanho da viewport
- Timezone
- Detecção de mobile

### Informações da Página
- URL completa
- Título da página
- Referrer
- Domínio
- Path
- Parâmetros de busca
- Hash

### Parâmetros de UTM
- utm_source
- utm_medium
- utm_campaign
- utm_term
- utm_content
- gclid (Google Ads)
- fbclid (Facebook Ads)

### Dados de E-commerce
- Preços (detectados automaticamente)
- Nomes de produtos
- Categorias

### Métricas de Engajamento
- Profundidade do scroll
- Tempo na página
- Número de cliques
- Interações com formulários
- Visibilidade da página

### Dados de Performance
- Tempo de carregamento
- DOM ready time
- First paint
- Tipo de navegação
- Número de redirecionamentos

## 🔧 Configuração Avançada

### Variáveis de Ambiente
Crie um arquivo `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### Personalização do Script
Você pode personalizar o comportamento do Super Pixel:

```javascript
window.SUPER_PIXEL_CONFIG = {
  endpoint: 'https://seu-dominio.com/api/track',
  debug: false,
  trackScrollDepth: true,
  trackTimeOnPage: true,
  trackFormInteractions: true,
  scrollDepthThresholds: [25, 50, 75, 100]
};
```

## 🔒 Privacidade e LGPD

O Super Pixel foi desenvolvido com foco na privacidade:

- Não coleta dados pessoais identificáveis sem consentimento
- Gera IDs únicos para sessão e usuário (não vinculados a identidade real)
- Respeita configurações de cookies do navegador
- Permite opt-out fácil

### Implementar Consentimento de Cookies

```javascript
// Verificar consentimento antes de inicializar
if (userConsentedToCookies()) {
  // Carregar Super Pixel
  loadSuperPixel();
}
```

## 📈 Monitoramento

### Dashboard
- Visualize métricas em tempo real
- Acompanhe eventos por Super Pixel
- Monitore performance dos pixels

### API de Relatórios
```javascript
// Buscar eventos
GET /api/events?superPixelId=xxx&startDate=xxx&endDate=xxx

// Estatísticas
GET /api/stats?superPixelId=xxx
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação
2. Procure em issues existentes
3. Crie uma nova issue com detalhes do problema

## 🔄 Atualizações

Para manter o Super Pixel atualizado:

```bash
git pull origin main
npm install
npx prisma db push
npm run build
```

---

**Desenvolvido com ❤️ para otimizar suas campanhas do Facebook** 