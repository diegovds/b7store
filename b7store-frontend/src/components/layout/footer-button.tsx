import Image from 'next/image'
import Link from 'next/link'

type Props = {
  href: string
  icon: string
  label?: string
}
export const FooterButton = ({ href, icon, label }: Props) => {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 rounded-sm border border-gray-700 px-5 py-3 duration-300 hover:bg-gray-900">
        <Image src={icon} alt="" width={16} height={16} />
        {label && <div className="flex-1 text-base font-medium">{label}</div>}
      </div>
    </Link>
  )
}
