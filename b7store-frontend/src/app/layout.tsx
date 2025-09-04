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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
          <StoreHydration />
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="mx-auto max-w-6xl flex-1 p-6">{children}</main>
            <Footer />
          </div>
        </QueryClientContext>
      </body>
    </html>
  )
}
