import Image from 'next/image'

type InformationIconProps = {
  title: string
  description: string
  icon: string
}

export function InformationIcon({
  description,
  icon,
  title,
}: InformationIconProps) {
  return (
    <div className="flex flex-1 rounded-sm border border-gray-200 py-6">
      <div className="flex w-[120px] items-center justify-center border-r border-gray-200">
        <Image src={icon} alt={title} width={40} height={40} />
      </div>
      <div className="flex-1 pl-8">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}
