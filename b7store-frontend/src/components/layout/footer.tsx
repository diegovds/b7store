'use client'

import { MenuItem } from '@/types/menu-item'
import Image from 'next/image'
import Link from 'next/link'
import { FooterButton } from './footer-button'

export const Footer = () => {
  const menu: MenuItem[] = [
    { label: 'Camisetas', href: '/categories/camisetas' },
    { label: 'Bonés', href: '/categories/bones' },
  ]
  return (
    <footer>
      <div className="border-t border-gray-200 bg-white px-6 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 p-6 md:flex-row">
          <Image
            src={'/assets/ui/mail-send-line.png'}
            alt=""
            width={68}
            height={68}
          />
          <div className="flex flex-col items-center text-center md:items-start">
            <h3 className="mb-6 text-xl font-medium text-balance md:mb-2">
              Fique por dentro das promoções
            </h3>
            <p className="w-[55%] text-base text-gray-400 md:w-full">
              Coloque seu e-mail e seja o primeiro a saber
            </p>
          </div>
          <form
            method="POST"
            className="flex w-full flex-1 flex-col gap-4 md:flex-row"
          >
            <input
              type="text"
              className="flex-1 rounded-sm border border-gray-200 px-6 py-5 outline-0"
              placeholder="Qual seu e-mail?"
            />
            <input
              type="submit"
              value="Enviar"
              className="w-full rounded-sm border-0 bg-blue-600 px-6 py-5 text-white md:w-50"
            />
          </form>
        </div>
      </div>
      <div className="bg-black text-white">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-16 border-b border-gray-700 py-24 md:flex-row md:py-10">
            <Link href="/">
              <Image
                src={'/assets/ui/logo-white.png'}
                alt="B7Store"
                width={143}
                height={48}
              />
            </Link>
            <ul className="flex flex-col items-center gap-12 md:flex-row">
              {menu.map((item, index) => (
                <li key={index} className="text-lg font-medium">
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 border-b border-gray-700 py-16 md:flex-row md:py-10">
            <div className="flex-1">
              <h4 className="mb-10 text-center text-lg md:text-left">
                Precisa de ajuda?
              </h4>
              <div className="flex flex-col gap-6 md:flex-row">
                <FooterButton
                  href="mailto:suporte@b7web.com.br"
                  icon="/assets/ui/mail-line.png"
                  label="suporte@b7web.com.br"
                />
                <FooterButton
                  href=""
                  icon="/assets/ui/phone-line.png"
                  label="(11) 99999-9999"
                />
              </div>
            </div>
            <div className="">
              <h4 className="mt-8 mb-10 text-center text-lg md:mt-0 md:text-left">
                Acompanhe nas redes sociais
              </h4>
              <div className="flex flex-row justify-between gap-6">
                <FooterButton href="" icon="/assets/ui/instagram-line.png" />
                <FooterButton href="" icon="/assets/ui/linkedin-line.png" />
                <FooterButton href="" icon="/assets/ui/facebook-line.png" />
                <FooterButton href="" icon="/assets/ui/twitter-x-fill.png" />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center py-16 md:justify-end md:py-10">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex cursor-pointer rounded-sm border border-gray-700 px-5 py-3 duration-300 hover:bg-gray-900"
            >
              <Image
                src="/assets/ui/arrow-up-line.png"
                alt=""
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
