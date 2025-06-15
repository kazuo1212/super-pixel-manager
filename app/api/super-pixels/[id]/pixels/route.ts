import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, pixelId, accessToken } = await request.json()

    if (!name || !pixelId) {
      return NextResponse.json(
        { error: 'Nome e ID do pixel são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o Super Pixel existe
    const superPixel = await prisma.superPixel.findUnique({
      where: { id: params.id }
    })

    if (!superPixel) {
      return NextResponse.json(
        { error: 'Super Pixel não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe um pixel com este ID
    const existingPixel = await prisma.pixel.findFirst({
      where: { pixelId }
    })

    if (existingPixel) {
      return NextResponse.json(
        { error: 'Já existe um pixel com este ID' },
        { status: 409 }
      )
    }

    const pixel = await prisma.pixel.create({
      data: {
        name,
        pixelId,
        accessToken: accessToken || '',
        superPixelId: params.id
      }
    })

    return NextResponse.json(pixel)
  } catch (error) {
    console.error('Erro ao criar pixel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 