import type { Product } from "./products"

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

export const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export const addToCart = (items: CartItem[], product: Product): CartItem[] => {
  const existingItem = items.find((item) => item.product.id === product.id)

  if (existingItem) {
    return items.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
  }

  return [...items, { product, quantity: 1 }]
}

export const removeFromCart = (items: CartItem[], productId: string): CartItem[] => {
  return items.filter((item) => item.product.id !== productId)
}

export const updateQuantity = (items: CartItem[], productId: string, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return removeFromCart(items, productId)
  }

  return items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
}
