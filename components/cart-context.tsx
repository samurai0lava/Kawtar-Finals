"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Product } from "@/lib/products"
import type { CartState } from "@/lib/cart"
import { addToCart, removeFromCart, updateQuantity, calculateCartTotal, calculateItemCount } from "@/lib/cart"

type CartAction =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }

interface CartContextType extends CartState {
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateItemQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItems = addToCart(state.items, action.product)
      return {
        items: newItems,
        total: calculateCartTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }
    case "REMOVE_FROM_CART": {
      const newItems = removeFromCart(state.items, action.productId)
      return {
        items: newItems,
        total: calculateCartTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }
    case "UPDATE_QUANTITY": {
      const newItems = updateQuantity(state.items, action.productId, action.quantity)
      return {
        items: newItems,
        total: calculateCartTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }
    case "CLEAR_CART": {
      return {
        items: [],
        total: 0,
        itemCount: 0,
      }
    }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", product })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId })
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
