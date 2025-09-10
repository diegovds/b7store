import { getCartState } from '@/actions/get-cart-state'
import { getProductsFromList } from '@/actions/get-products-from-list'
import { CartContainer } from '@/components/cart/cart-container'
import { CartListItem } from '@/types/cart-list-item'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Carrinho de compras',
}

export default async function CartPage() {
  const { cart: initialCart } = await getCartState()

  if (initialCart.length === 0) {
    redirect('/')
  }

  const cartProducts: CartListItem[] = []
  let subtotal = 0

  const ids = initialCart.map((item) => item.productId)
  const products = await getProductsFromList(ids)

  if (!products) redirect('/')

  for (const cartItem of initialCart) {
    const prodIndex = products.products.findIndex(
      (i) => i.id === cartItem.productId,
    )
    if (prodIndex > -1) {
      cartProducts.push({
        product: products.products[prodIndex],
        quantity: cartItem.quantity,
      })

      subtotal += products.products[prodIndex].price * cartItem.quantity
    }
  }

  return (
    <CartContainer
      initialCartProducts={cartProducts}
      initialSubtotal={subtotal}
    />
  )
}
