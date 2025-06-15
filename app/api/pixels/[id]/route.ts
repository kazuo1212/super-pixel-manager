import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, pixelId, accessToken, isActive } = await request.json()

    const pixel = await prisma.pixel.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(pixelId && { pixelId }),
        ...(accessToken !== undefined && { accessToken }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(pixel)
  } catch (error) {
    console.error('Erro ao atualizar pixel:', error)
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
    await prisma.pixel.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Pixel removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover pixel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 