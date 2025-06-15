const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testLogin() {
  try {
    console.log('🔍 Testando conexão com o banco...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão com banco estabelecida')
    
    // Buscar usuário admin
    const user = await prisma.user.findUnique({
      where: { email: 'admin@superpixel.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário admin não encontrado!')
      console.log('📝 Criando usuário admin...')
      
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const newUser = await prisma.user.create({
        data: {
          id: 'cmbxzg14k000ertbpic1trvsx',
          name: 'Admin',
          email: 'admin@superpixel.com',
          password: hashedPassword,
        }
      })
      
      console.log('✅ Usuário admin criado:', newUser.email)
    } else {
      console.log('✅ Usuário admin encontrado:', user.email)
      
      // Testar senha
      const isPasswordValid = await bcrypt.compare('admin123', user.password)
      console.log('🔐 Senha válida:', isPasswordValid)
      
      if (!isPasswordValid) {
        console.log('🔧 Atualizando senha...')
        const hashedPassword = await bcrypt.hash('admin123', 12)
        
        await prisma.user.update({
          where: { email: 'admin@superpixel.com' },
          data: { password: hashedPassword }
        })
        
        console.log('✅ Senha atualizada!')
      }
    }
    
    // Listar todos os usuários
    const allUsers = await prisma.user.findMany()
    console.log('👥 Usuários no banco:', allUsers.length)
    allUsers.forEach(u => console.log(`  - ${u.email} (${u.name})`))
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin() 