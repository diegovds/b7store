import { setCartState } from '@/actions/set-cart-state'
import { useCartStore } from '@/store/cart'
import { CartListItem } from '@/types/cart-list-item'
import Image from 'next/image'

type CartProductItemProps = {
  item: CartListItem
}

export const CartProductItem = ({ item }: CartProductItemProps) => {
  const { updateQuantity, removeItem } = useCartStore()

  const updateCookie = async () => {
    const updatedCart = useCartStore.getState().cart
    await setCartState(updatedCart)
  }

  const handleMinus = async () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1)
      await updateCookie()
    } else {
      await handleRemove()
    }
  }

  const handlePlus = async () => {
    updateQuantity(item.product.id, item.quantity + 1)
    await updateCookie()
  }

  const handleRemove = async () => {
    removeItem(item.product.id)
    await updateCookie()
  }

  return (
    <div className="flex gap-4 border-0 border-gray-200 p-6 md:gap-8 md:border-b">
      <div className="flex aspect-square size-24 items-center justify-center border border-gray-200 p-1 md:size-20">
        {item.product.image && (
          <Image
            src={item.product.image}
            alt={item.product.label}
            width={96}
            height={96}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between md:flex-row md:items-center">
        <div className="space-y-0 md:space-y-1.5">
          <div className="text-sm font-medium">{item.product.label}</div>
          <div className="hidden text-xs text-gray-500 md:block">
            CÓD: {item.product.id}
          </div>
        </div>
        <div>
          <div className="flex w-fit rounded-sm border border-gray-200 text-lg font-medium text-[#7f7f7f]">
            <button
              onClick={handleMinus}
              className="flex size-10 cursor-pointer items-center justify-center"
            >
              -
            </button>
            <div className="flex size-10 items-center justify-center border-x border-gray-200">
              {item.quantity}
            </div>
            <button
              onClick={handlePlus}
              className="flex size-10 cursor-pointer items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-24 flex-col items-end justify-between md:w-40 md:flex-row md:items-center">
        <div className="text-lg font-medium text-blue-600">
          R$ {item.product.price.toFixed(2)}
        </div>
        <div>
          <button
            onClick={handleRemove}
            className="flex size-10 cursor-pointer items-center justify-center rounded border border-gray-200 md:size-12"
          >
            <Image
              src={'/assets/ui/trash.png'}
              alt=""
              width={24}
              height={24}
              className="size-5 md:size-6"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
