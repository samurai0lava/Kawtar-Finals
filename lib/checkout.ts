export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentMethod {
  type: "card" | "paypal" | "apple_pay"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
}

export interface Order {
  id: string
  userId: string
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
    image: string
  }>
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  createdAt: Date
}

export const calculateTax = (subtotal: number): number => {
  return subtotal * 0.08 // 8% tax rate
}

export const calculateShipping = (subtotal: number): number => {
  return subtotal > 100 ? 0 : 9.99 // Free shipping over $100
}

export const mockProcessPayment = async (
  paymentMethod: PaymentMethod,
  amount: number,
): Promise<{ success: boolean; transactionId?: string }> => {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock payment success (90% success rate)
  const success = Math.random() > 0.1

  if (success) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  } else {
    throw new Error("Payment failed. Please try again.")
  }
}
