import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Verificar se o usuário admin já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@superpixel.com' }
    })

    if (existingUser) {
      return NextResponse.json({ 
        message: 'Setup já foi executado. Usuário admin já existe.',
        user: { email: existingUser.email, name: existingUser.name }
      })
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@superpixel.com',
        name: 'Admin',
        password: hashedPassword,
      }
    })

    return NextResponse.json({ 
      message: 'Setup concluído com sucesso!',
      user: { email: adminUser.email, name: adminUser.name }
    })

  } catch (error) {
    console.error('Erro durante o setup:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro durante o setup', 
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// Endpoint GET para verificar status
export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const superPixelCount = await prisma.superPixel.count()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      users: userCount,
      superPixels: superPixelCount,
      setupRequired: userCount === 0
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
} 