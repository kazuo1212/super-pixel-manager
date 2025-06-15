#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Super Pixel Manager - Setup para Deploy\n');

// Verificar se o projeto está pronto para deploy
function checkDeployReadiness() {
  console.log('📋 Verificando pré-requisitos para deploy...\n');
  
  const checks = [
    {
      name: 'package.json existe',
      check: () => fs.existsSync('package.json'),
      fix: 'Execute npm init para criar package.json'
    },
    {
      name: 'Schema Prisma configurado',
      check: () => fs.existsSync('prisma/schema.prisma'),
      fix: 'Verifique se o arquivo prisma/schema.prisma existe'
    },
    {
      name: 'Schema SQL do Supabase existe',
      check: () => fs.existsSync('supabase-schema.sql'),
      fix: 'Arquivo supabase-schema.sql não encontrado'
    },
    {
      name: 'Componentes principais existem',
      check: () => fs.existsSync('components/EventsTerminal.tsx'),
      fix: 'Componentes não encontrados'
    }
  ];

  let allPassed = true;
  
  checks.forEach(check => {
    const passed = check.check();
    console.log(`${passed ? '✅' : '❌'} ${check.name}`);
    if (!passed) {
      console.log(`   💡 ${check.fix}`);
      allPassed = false;
    }
  });

  console.log('');
  return allPassed;
}

// Gerar exemplo de .env.local
function generateEnvExample() {
  const envContent = `# Supabase Database
DATABASE_URL="postgresql://postgres:mm273281@db.SEU-ID.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="super-pixel-manager-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"

# Super Pixel Configuration
SUPER_PIXEL_ENDPOINT="http://localhost:3000/api/track"

# Facebook API (opcional)
FACEBOOK_APP_ID=""
FACEBOOK_APP_SECRET=""
`;

  fs.writeFileSync('.env.example', envContent);
  console.log('✅ Arquivo .env.example criado');
}

// Mostrar instruções de deploy
function showDeployInstructions() {
  console.log(`
🎯 PRÓXIMOS PASSOS PARA DEPLOY:

1. 📁 GITHUB:
   - Crie repositório: https://github.com/new
   - Nome: super-pixel-manager
   - Execute: git remote add origin https://github.com/SEU-USUARIO/super-pixel-manager.git
   - Execute: git push -u origin main

2. 🗄️ SUPABASE:
   - Acesse: https://supabase.com/dashboard
   - Crie novo projeto: super-pixel-manager
   - Senha: mm273281
   - Execute o SQL do arquivo: supabase-schema.sql
   - Copie a URL de conexão

3. 🌐 VERCEL:
   - Acesse: https://vercel.com/dashboard
   - Importe o repositório do GitHub
   - Configure variáveis de ambiente:
     * DATABASE_URL (do Supabase)
     * NEXTAUTH_SECRET=super-pixel-manager-secret-key-2024
     * NEXTAUTH_URL=https://seu-projeto.vercel.app
     * SUPER_PIXEL_ENDPOINT=https://seu-projeto.vercel.app/api/track
   - Faça o deploy

4. 🧪 TESTE:
   - Acesse: https://seu-projeto.vercel.app
   - Login: admin@superpixel.com / admin123
   - Verifique dashboard e terminal

📖 Guia completo: DEPLOY-AGORA-COMPLETO.md
`);
}

// Executar setup
function main() {
  if (checkDeployReadiness()) {
    console.log('🎉 Projeto pronto para deploy!\n');
    generateEnvExample();
    showDeployInstructions();
  } else {
    console.log('❌ Projeto não está pronto para deploy. Corrija os problemas acima.\n');
    process.exit(1);
  }
}

main(); 