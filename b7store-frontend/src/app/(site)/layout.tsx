import { Header } from '@/components/layout/header'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  )
}
