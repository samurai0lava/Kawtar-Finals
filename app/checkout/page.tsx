"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { ShippingAddress, PaymentMethod } from "@/lib/checkout"
import { calculateTax, calculateShipping, mockProcessPayment } from "@/lib/checkout"
import { ArrowLeft, CreditCard, Smartphone, Loader2, CheckCircle, Shield } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total: subtotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [error, setError] = useState("")

  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  
  // For demo purposes, use demo totals when cart is empty
  const demoSubtotal = 1448.00 // iPhone + AirPods
  const demoShipping = calculateShipping(demoSubtotal)
  const demoTax = calculateTax(demoSubtotal)
  const demoTotal = demoSubtotal + demoShipping + demoTax
  
  const displaySubtotal = items.length > 0 ? subtotal : demoSubtotal
  const displayShipping = items.length > 0 ? shipping : demoShipping
  const displayTax = items.length > 0 ? tax : demoTax
  const total = items.length > 0 ? subtotal + shipping + tax : demoTotal

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.name.split(" ")[0] || "Demo",
    lastName: user?.name.split(" ")[1] || "User",
    email: user?.email || "demo@techstore.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "US",
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "card",
    cardNumber: "4000 0000 0000 0002",
    expiryDate: "12/25",
    cvv: "123",
    cardholderName: "Demo User",
  })

  useEffect(() => {
    // For demo purposes, allow checkout even without authentication
    // In production, uncomment the authentication check below
    
    /*
    if (!isAuthenticated) {
      router.push("/")
      return
    }
    */
    
    if (items.length === 0 && !orderComplete) {
      // For demo purposes, create a sample cart item if empty
      console.log("Demo mode: Adding sample items to cart for demonstration")
      // Note: In a real app, redirect to home if cart is empty
      // router.push("/")
      // return
    }
  }, [isAuthenticated, items.length, orderComplete, router])

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(2)
  }

    const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsProcessing(true)

    try {
      // Validate payment method
      if (paymentMethod.type === "card") {
        if (!paymentMethod.cardNumber || !paymentMethod.expiryDate || !paymentMethod.cvv || !paymentMethod.cardholderName) {
          setError("Please fill in all card details")
          return
        }
      }

      // Simulate initial payment validation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to FIDO 3DS authentication
      const transactionId = `TX-${Date.now()}`
      const queryParams = new URLSearchParams({
        transactionId,
        amount: total.toString(),
        returnUrl: window.location.origin + '/checkout/success'
      })

      router.push(`/fido-auth?${queryParams.toString()}`)
      
    } catch (error) {
      setError("Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isAuthenticated || (items.length === 0 && !orderComplete)) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Button>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Notice */}
        {items.length === 0 && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Demo Mode:</strong> This checkout page is loaded with sample products to demonstrate the FIDO 3D Secure authentication flow.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {orderComplete && step === 3 ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  <span className="text-sm font-medium">
                    {step === 1 && "Shipping"}
                    {step === 2 && "Payment"}
                    {step === 3 && "Complete"}
                  </span>
                  {step < 3 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <Alert className="bg-blue-50 border-blue-200">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Enhanced Security:</strong> This transaction will use FIDO-based 3D Secure authentication for maximum security and convenience.
                    </AlertDescription>
                  </Alert>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <RadioGroup
                      value={paymentMethod.type}
                      onValueChange={(value) =>
                        setPaymentMethod({ ...paymentMethod, type: value as "card" | "paypal" | "apple_pay" })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Credit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apple_pay" id="apple_pay" />
                        <Label htmlFor="apple_pay">Apple Pay</Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod.type === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            value={paymentMethod.cardholderName}
                            onChange={(e) => setPaymentMethod({ ...paymentMethod, cardholderName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentMethod.cardNumber}
                            onChange={(e) => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={paymentMethod.expiryDate}
                              onChange={(e) => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentMethod.cvv}
                              onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                        Back to Shipping
                      </Button>
                      <Button type="submit" disabled={isProcessing} className="flex-1">
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay $${total.toFixed(2)}`
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Complete */}
            {currentStep === 3 && orderComplete && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold">Order Complete!</h2>
                    <p className="text-muted-foreground">
                      Thank you for your purchase. You'll receive a confirmation email shortly.
                    </p>
                    <Button onClick={() => router.push("/")} className="mt-4">
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Demo items for when cart is empty */}
                {items.length === 0 ? (
                  <>
                    <div className="flex gap-3">
                      <img
                        src="/iphone-15-pro-max-titanium.png"
                        alt="iPhone 15 Pro Max"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">iPhone 15 Pro Max</h4>
                        <p className="text-sm text-muted-foreground">Apple</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline">Qty: 1</Badge>
                          <span className="font-medium">$1,199.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <img
                        src="/airpods-pro-2nd-generation-white-case.png"
                        alt="AirPods Pro"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">AirPods Pro (2nd gen)</h4>
                        <p className="text-sm text-muted-foreground">Apple</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline">Qty: 1</Badge>
                          <span className="font-medium">$249.00</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline">Qty: {item.quantity}</Badge>
                          <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${displaySubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{displayShipping === 0 ? "Free" : `$${displayShipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${displayTax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {displayShipping === 0 && (
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800">Free Shipping!</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
