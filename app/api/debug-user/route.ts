import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Testar conexão
    await prisma.$connect()
    
    // Buscar usuário admin
    const user = await prisma.user.findUnique({
      where: { email: 'admin@superpixel.com' }
    })
    
    if (!user) {
      // Criar usuário se não existir
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const newUser = await prisma.user.create({
        data: {
          id: 'admin-user-' + Date.now(),
          name: 'Admin',
          email: 'admin@superpixel.com',
          password: hashedPassword,
        }
      })
      
      return NextResponse.json({
        success: true,
        action: 'created',
        message: 'Usuário admin criado com sucesso',
        user: { 
          email: newUser.email, 
          name: newUser.name,
          id: newUser.id
        }
      })
    }
    
    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare('admin123', user.password)
    
    if (!isPasswordValid) {
      // Atualizar senha se estiver incorreta
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      await prisma.user.update({
        where: { email: 'admin@superpixel.com' },
        data: { password: hashedPassword }
      })
      
      return NextResponse.json({
        success: true,
        action: 'password_updated',
        message: 'Senha do usuário admin foi atualizada',
        user: { 
          email: user.email, 
          name: user.name,
          id: user.id
        }
      })
    }
    
    // Usuário existe e senha está correta
    return NextResponse.json({
      success: true,
      action: 'verified',
      message: 'Usuário admin existe e senha está correta',
      user: { 
        email: user.email, 
        name: user.name,
        id: user.id
      }
    })
    
  } catch (error) {
    console.error('Erro no debug:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 