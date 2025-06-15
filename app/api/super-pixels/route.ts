import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Em um cenário real, você pegaria o userId da sessão/token
    const userId = 'user-id-from-session' // Placeholder

    const superPixels = await prisma.superPixel.findMany({
      where: { userId },
      include: {
        pixels: true,
        _count: {
          select: { events: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(superPixels)
  } catch (error) {
    console.error('Erro ao buscar super pixels:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()
    const userId = 'user-id-from-session' // Placeholder

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const superPixel = await prisma.superPixel.create({
      data: {
        name,
        description: description || '',
        userId
      },
      include: {
        pixels: true,
        _count: {
          select: { events: true }
        }
      }
    })

    return NextResponse.json(superPixel)
  } catch (error) {
    console.error('Erro ao criar super pixel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 