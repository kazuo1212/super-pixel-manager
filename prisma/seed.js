const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Criando usuário admin...');
  
  // Hash da senha admin123
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  // Criar usuário admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@superpixel.com' },
    update: {},
    create: {
      id: 'admin-user-id',
      name: 'Admin',
      email: 'admin@superpixel.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuário admin criado:', admin.email);
  
  // Criar um Super Pixel de exemplo
  const superPixel = await prisma.superPixel.upsert({
    where: { id: 'demo-super-pixel' },
    update: {},
    create: {
      id: 'demo-super-pixel',
      name: 'Super Pixel Demo',
      description: 'Super Pixel de demonstração',
      userId: admin.id,
    },
  });

  console.log('✅ Super Pixel demo criado:', superPixel.name);
  
  // Criar um pixel de exemplo
  const pixel = await prisma.pixel.create({
    data: {
      name: 'Pixel Facebook Demo',
      pixelId: '123456789',
      accessToken: 'demo-access-token',
      superPixelId: superPixel.id,
    },
  });

  console.log('✅ Pixel demo criado:', pixel.name);
  console.log('\n🎯 Login de teste:');
  console.log('   Email: admin@superpixel.com');
  console.log('   Senha: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 