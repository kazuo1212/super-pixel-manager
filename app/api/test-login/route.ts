import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Verificar credenciais demo
    if (email === 'admin@superpixel.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        message: 'Login demo funcionando!',
        user: {
          id: 'demo-user',
          email: 'admin@superpixel.com',
          name: 'Admin (Demo)'
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Credenciais inválidas'
    }, { status: 401 })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Erro no servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 