import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email e senha são obrigatórios'
      }, { status: 400 })
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        superPixels: {
          include: {
            pixels: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado'
      }, { status: 401 })
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Senha inválida'
      }, { status: 401 })
    }

    // Login bem-sucedido
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      superPixels: user.superPixels
    }

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: userResponse
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Permitir OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// Endpoint GET para debug
export async function GET() {
  try {
    await prisma.$connect()
    
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Usuários encontrados',
      users: users
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 