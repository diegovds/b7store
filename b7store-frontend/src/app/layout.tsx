import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'B7Store',
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
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
