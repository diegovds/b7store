'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { HeaderIcon } from './header-icon'
import { HeaderSearch } from './header-search'

type MenuItem = {
  label: string
  href: string
}

export function Header() {
  const [menuOpened, setMenuOpened] = useState(false)

  const menu: MenuItem[] = [
    { label: 'Camisa', href: '/categories/camisa' },
    { label: 'Kits', href: '/categories/kits' },
  ]

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="bg-black p-4 text-center text-base text-white">
        <strong>FRETE GRÁTIS</strong> para todo o Nordeste nas compras acima de
        R$ 199,00.
        <strong>APROVEITA!</strong>
      </div>
      <div className="mx-auto w-full max-w-6xl p-6">
        <div className="flex items-center justify-between">
          <div className="w-32">
            <Link href="/">
              <Image
                src="/assets/ui/logo-black.png"
                alt="B7Store"
                width={120}
                height={40}
                quality={100}
              />
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/my-orders">
              <HeaderIcon alt="Perfil" src="/assets/ui/user-line.png" />
            </Link>
            <Link href="/cart">
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
          <Link key={item.label} href={item.href}>
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div className="text-lg font-medium text-gray-500">
                {item.label}
              </div>
              <Image
                src={`/assets/ui/arrow-up-right.png`}
                alt="Ir para a categoria"
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
