import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
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
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  )
}
