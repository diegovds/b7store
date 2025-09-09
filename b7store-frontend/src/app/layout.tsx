import { getAuthState } from '@/actions/get-auth-state'
import { getCartState } from '@/actions/get-cart-state'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { QueryClientContext } from '@/providers/queryclient'
import { StoreHydration } from '@/providers/store-hydration'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const poppins = Poppins({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-poppins',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'B7Store',
    template: '%s | B7Store',
  },
  description:
    'B7Store - Loja virtual de roupas e acessórios com as melhores ofertas e novidades.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { token } = await getAuthState()
  const { cart } = await getCartState()

  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} antialiased`}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'Poppins, sans-serif',
              fontSize: '15px',
            },
          }}
          richColors
        />
        <QueryClientContext>
          <StoreHydration token={token} cart={cart} />
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
              {children}
            </main>
            <Footer />
          </div>
        </QueryClientContext>
      </body>
    </html>
  )
}
