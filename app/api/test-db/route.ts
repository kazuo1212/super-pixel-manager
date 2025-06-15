import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Teste simples de conexão
    const userCount = await prisma.user.count()
    const superPixelCount = await prisma.superPixel.count()
    const pixelCount = await prisma.pixel.count()
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com banco de dados OK!',
      data: {
        users: userCount,
        superPixels: superPixelCount,
        pixels: pixelCount
      }
    })
  } catch (error) {
    console.error('Erro na conexão com banco:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 