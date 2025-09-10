'use client'

import { MenuItem } from '@/types/menu-item'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HeaderIcon } from './header-icon'
import { HeaderSearch } from './header-search'

export function Header() {
  const [menuOpened, setMenuOpened] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryString = searchParams.toString() // mantém todos: "q=on&tech=react"
  const from = encodeURIComponent(`${pathname}?${queryString}`)

  useEffect(() => {
    setMenuOpened(false)
  }, [pathname])

  const menu: MenuItem[] = [
    { label: 'Camisetas', href: '/categories/camisetas' },
    { label: 'Bonés', href: '/categories/bones' },
  ]

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="hidden bg-black p-4 text-center text-base text-white md:block">
        <strong>FRETE GRÁTIS</strong> para todo o Nordeste nas compras acima de
        R$ 199,00.
        <strong> APROVEITA!</strong>
      </div>
      <div className="bg-black p-4 text-center text-xs text-white md:hidden">
        <strong>FRETE GRÁTIS</strong> para todo o Nordeste!
      </div>
      <div className="mx-auto w-full max-w-6xl p-6">
        <div className="flex items-center">
          <div className="flex items-center md:pb-3">
            <Link href="/">
              <Image
                src="/assets/ui/logo-black.png"
                alt="B7Store"
                width={142}
                height={40}
                quality={100}
              />
            </Link>
          </div>
          <div className="flex-1">
            <div className="hidden gap-6 px-6 md:flex md:items-center md:justify-between">
              <ul className="flex flex-1 gap-10 text-gray-500">
                {menu.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-base font-medium">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="w-80">
                <HeaderSearch />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/my-orders">
              <HeaderIcon alt="Perfil" src="/assets/ui/user-line.png" />
            </Link>
            <Link href={`/cart?from=${from}`}>
              <HeaderIcon
                alt="Carrinho"
                src="/assets/ui/shopping-bag-4-line.png"
              />
            </Link>
            <div
              className="md:hidden"
              onClick={() => setMenuOpened(!menuOpened)}
            >
              <HeaderIcon
                alt="Menu"
                src={
                  !menuOpened
                    ? '/assets/ui/menu-line.png'
                    : '/assets/ui/menu-line-white.png'
                }
                selected={menuOpened}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`overflow-hidden duration-300 md:hidden ${menuOpened ? 'mb-6 max-h-[154px]' : 'max-h-0'}`}
      >
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setMenuOpened(!menuOpened)}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div className="text-lg font-medium text-gray-500">
                {item.label}
              </div>
              <Image
                src={`/assets/ui/arrow-up-right.png`}
                alt=""
                width={24}
                height={24}
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="px-6 pb-6 md:hidden">
        <HeaderSearch />
      </div>
    </header>
  )
}
