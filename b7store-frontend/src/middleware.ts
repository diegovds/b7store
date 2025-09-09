import { getAuthState } from '@/actions/get-auth-state'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { token } = await getAuthState()
  const url = req.nextUrl.clone()

  // Rotas públicas que não devem ser acessadas se o usuário estiver logado
  const publicRoutes = ['/login', '/register']

  // Rotas privadas que requerem autenticação
  const privateRoutes = ['/my-orders']

  // Usuário logado tenta acessar Login ou Register → redireciona para MyOrders
  if (token && publicRoutes.some((path) => url.pathname.startsWith(path))) {
    url.pathname = '/my-orders'
    return NextResponse.redirect(url)
  }

  // Usuário não logado tenta acessar rota privada → redireciona para Login
  if (!token && privateRoutes.some((path) => url.pathname.startsWith(path))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Caso contrário, deixa passar normalmente
  return NextResponse.next()
}

// Configuração: quais rotas o middleware deve interceptar
export const config = {
  matcher: ['/login', '/register', '/my-orders'],
}
