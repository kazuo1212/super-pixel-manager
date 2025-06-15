import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Verificar se já existe usuário admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@superpixel.com' }
    })

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Setup já foi executado anteriormente',
        status: 'already_setup'
      })
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@superpixel.com',
        password: hashedPassword
      }
    })

    // Criar Super Pixel de exemplo
    const exampleSuperPixel = await prisma.superPixel.create({
      data: {
        name: 'Super Pixel de Exemplo',
        description: 'Um Super Pixel de demonstração para você começar',
        userId: admin.id
      }
    })

    // Criar pixel de exemplo
    await prisma.pixel.create({
      data: {
        name: 'Pixel Principal',
        pixelId: '123456789012345',
        accessToken: '',
        superPixelId: exampleSuperPixel.id
      }
    })

    return NextResponse.json({
      message: 'Setup executado com sucesso!',
      status: 'success',
      credentials: {
        email: 'admin@superpixel.com',
        password: 'admin123',
        warning: 'Altere a senha após o primeiro login!'
      }
    })

  } catch (error) {
    console.error('Erro no setup:', error)
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