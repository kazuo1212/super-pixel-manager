import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Permitir acesso público a estas rotas
  const publicPaths = [
    '/api/public-login',
    '/api/test-db',
    '/login',
    '/',
    '/api/auth',
    '/api/events'
  ]

  const { pathname } = request.nextUrl

  // Se for uma rota pública, permitir acesso
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Para outras rotas, verificar autenticação
  const userCookie = request.cookies.get('user')
  
  if (!userCookie && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 