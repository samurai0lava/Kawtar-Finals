"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { products, categories } from "@/lib/products"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { CartDrawer } from "@/components/cart-drawer"
import { AuthDialog } from "@/components/auth-dialog"
import { UserMenu } from "@/components/user-menu"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Smartphone, Laptop, Headphones, User, Shield } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [searchQuery, setSearchQuery] = useState("")
  const { items, total, itemCount, addItem, updateItemQuantity, removeItem } = useCart()
  const { isAuthenticated } = useAuth()

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Please login to proceed with checkout")
      return
    }
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Kawtar-tech-store</h1>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span>FIDO 3DS Secured</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <CartDrawer
                items={items}
                total={total}
                itemCount={itemCount}
                onUpdateQuantity={updateItemQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
              />

              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <AuthDialog>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                </AuthDialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Latest Tech at Your Fingertips</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Discover cutting-edge smartphones, powerful laptops, and premium audio gear from the world's leading tech
            brands.
          </p>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Smartphone className="w-6 h-6 text-primary" />
              <span>Smartphones</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Laptop className="w-6 h-6 text-primary" />
              <span>Laptops</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Headphones className="w-6 h-6 text-primary" />
              <span>Audio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Browse Products</h3>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <ProductGrid products={filteredProducts} onAddToCart={addItem} />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Kawtar-tech-store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
