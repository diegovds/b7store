'use client'

import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { ShippingBoxLogged } from './shipping-box-logged'
import { ShippingBoxNotLogged } from './shipping-box-not-logged'

export const ShippingBox = () => {
  const { token, hydrated } = useAuthStore()
  const { shippingDays, shippingCost } = useCartStore()

  if (!hydrated) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="text-gray-500">Calcular frete e prazo</div>
      <div>{!token ? <ShippingBoxNotLogged /> : <ShippingBoxLogged />}</div>
      {shippingDays > 0 && (
        <div className="flex items-center rounded-sm border border-gray-200 bg-white px-4 py-6 md:px-8 md:py-6">
          <div className="flex-1 text-base">
            Receba em até {shippingDays}{' '}
            {shippingDays !== 1 ? 'dias úteis' : 'dia útil'}
          </div>
          <div className="font-semibold text-[#6AB70A]">
            R$ {shippingCost.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  )
}
