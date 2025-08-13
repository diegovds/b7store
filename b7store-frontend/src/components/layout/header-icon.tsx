import Image from 'next/image'

type HeaderIconProps = {
  src: string
  alt: string
  selected?: boolean
}

export function HeaderIcon({ alt, selected, src }: HeaderIconProps) {
  return (
    <div
      className={`flex size-12 items-center justify-center rounded-sm border border-gray-200 duration-300 ${selected ? 'bg-blue-600' : 'hover:bg-gray-100'}`}
    >
      <Image src={src} alt={alt} width={24} height={24} quality={100} />
    </div>
  )
}
