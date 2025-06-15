import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const superPixel = await prisma.superPixel.findUnique({
      where: { id: params.id },
      include: {
        pixels: true,
        _count: {
          select: { events: true }
        }
      }
    })

    if (!superPixel) {
      return NextResponse.json(
        { error: 'Super Pixel não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(superPixel)
  } catch (error) {
    console.error('Erro ao buscar super pixel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, isActive } = await request.json()

    const superPixel = await prisma.superPixel.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
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
    console.error('Erro ao atualizar super pixel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.superPixel.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Super Pixel removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover super pixel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 