import Image from 'next/image'
import { ReactNode } from 'react'

type PageFormProps = {
  logo: string
  title: string
  subtitle: string
  children: ReactNode
}

export const PageForm = ({
  children,
  logo,
  subtitle,
  title,
}: PageFormProps) => {
  return (
    <div className="my-4 flex w-full max-w-md flex-col items-center justify-center md:my-0">
      <div className="mb-8 flex justify-center">
        <Image src={logo} alt="" width={143} height={48} />
      </div>

      <h2 className="text-center text-2xl font-semibold">{title}</h2>
      <p className="mt-2 mb-6 text-center text-lg text-gray-500">{subtitle}</p>
      {children}
    </div>
  )
}
