import { getAuthState } from '@/actions/get-auth-state'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getCartState } from './actions/get-cart-state'

export async function middleware(req: NextRequest) {
  const { token } = await getAuthState()
  const { cart } = await getCartState()
  const url = req.nextUrl.clone()

  // Captura a URL anterior via search params
  const from = url.searchParams.get('from') ?? '/'

  // Se carrinho vazio → redireciona para a URL anterior (ou home como fallback)
  if (cart.length === 0 && url.pathname.startsWith('/cart')) {
    return NextResponse.redirect(new URL(from, req.url))
  }

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
  matcher: ['/cart', '/login', '/register', '/my-orders'],
}
