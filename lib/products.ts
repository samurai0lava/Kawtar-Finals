export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand: string
  rating: number
  reviewCount: number
  description: string
  features: string[]
  inStock: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 1199,
    originalPrice: 1299,
    image: "/iphone-15-pro-max-titanium.png",
    category: "Smartphones",
    brand: "Apple",
    rating: 4.8,
    reviewCount: 2847,
    description: "The most advanced iPhone ever with titanium design and A17 Pro chip.",
    features: ["A17 Pro chip", "48MP camera system", "Titanium design", "USB-C"],
    inStock: true,
  },
  {
    id: "2",
    name: "MacBook Pro 16-inch M3",
    price: 2499,
    image: "/macbook-pro-16-inch-space-gray.png",
    category: "Laptops",
    brand: "Apple",
    rating: 4.9,
    reviewCount: 1523,
    description: "Supercharged by M3 Pro or M3 Max chip for relentless performance.",
    features: ["M3 Pro chip", "18-hour battery", "Liquid Retina XDR display", "1080p camera"],
    inStock: true,
  },
  {
    id: "3",
    name: "Sony WH-1000XM5",
    price: 399,
    originalPrice: 449,
    image: "/sony-wh-1000xm5-headphones-black.png",
    category: "Audio",
    brand: "Sony",
    rating: 4.7,
    reviewCount: 3241,
    description: "Industry-leading noise canceling with premium sound quality.",
    features: ["30-hour battery", "Quick charge", "Multipoint connection", "Touch controls"],
    inStock: true,
  },
  {
    id: "4",
    name: "Samsung Galaxy S24 Ultra",
    price: 1299,
    image: "/samsung-galaxy-s24-ultra-titanium.png",
    category: "Smartphones",
    brand: "Samsung",
    rating: 4.6,
    reviewCount: 1876,
    description: "Galaxy AI is here. Search like never before, get real-time interpretation.",
    features: ["200MP camera", "S Pen included", "Titanium frame", "Galaxy AI"],
    inStock: true,
  },
  {
    id: "5",
    name: "Dell XPS 13 Plus",
    price: 1399,
    originalPrice: 1599,
    image: "/dell-xps-13-plus-laptop-silver.png",
    category: "Laptops",
    brand: "Dell",
    rating: 4.5,
    reviewCount: 892,
    description: "Redesigned for a new era with edge-to-edge keyboard and seamless glass touchpad.",
    features: ["12th Gen Intel Core", "13.4-inch OLED", "Zero-lattice keyboard", "Gorilla Glass"],
    inStock: false,
  },
  {
    id: "6",
    name: "AirPods Pro (2nd Gen)",
    price: 249,
    image: "/airpods-pro-2nd-generation-white-case.png",
    category: "Audio",
    brand: "Apple",
    rating: 4.8,
    reviewCount: 4521,
    description: "Richer audio experience with Adaptive Audio and Personalized Spatial Audio.",
    features: ["H2 chip", "Adaptive Audio", "6 hours listening", "MagSafe charging"],
    inStock: true,
  },
]

export const categories = ["All Products", "Smartphones", "Laptops", "Audio", "Tablets", "Accessories"]
