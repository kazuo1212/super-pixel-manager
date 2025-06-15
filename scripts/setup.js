const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Configurando Super Pixel Manager...')

  // Criar usuário admin padrão
  const adminEmail = 'admin@superpixel.com'
  const adminPassword = 'admin123'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword
      }
    })

    console.log('✅ Usuário administrador criado:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Senha: ${adminPassword}`)
    console.log('   ⚠️  Altere a senha após o primeiro login!')

    // Criar Super Pixel de exemplo
    const exampleSuperPixel = await prisma.superPixel.create({
      data: {
        name: 'Super Pixel de Exemplo',
        description: 'Um Super Pixel de demonstração para você começar',
        userId: admin.id
      }
    })

    console.log('✅ Super Pixel de exemplo criado')

    // Criar pixel de exemplo
    await prisma.pixel.create({
      data: {
        name: 'Pixel Principal',
        pixelId: '123456789012345',
        accessToken: '',
        superPixelId: exampleSuperPixel.id
      }
    })

    console.log('✅ Pixel de exemplo criado')
  } else {
    console.log('ℹ️  Usuário administrador já existe')
  }

  console.log('\n🎉 Configuração concluída!')
  console.log('\n📋 Próximos passos:')
  console.log('1. Execute: npm run dev')
  console.log('2. Acesse: http://localhost:3000')
  console.log('3. Faça login com as credenciais acima')
  console.log('4. Configure seus pixels do Facebook')
  console.log('5. Implemente o código nas suas páginas')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a configuração:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 