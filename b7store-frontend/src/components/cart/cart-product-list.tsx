import { CartListItem } from '@/types/cart-list-item'
import { CartProductItem } from './cart-product-item'

type CartProductListProps = {
  initialList: CartListItem[]
}

export const CartProductList = ({ initialList }: CartProductListProps) => {
  return (
    <div className="border border-gray-200 bg-white md:border-b-0">
      {initialList.map((item) => (
        <CartProductItem key={item.product.id} item={item} />
      ))}
    </div>
  )
}
