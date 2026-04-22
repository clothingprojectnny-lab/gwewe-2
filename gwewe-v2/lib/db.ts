import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export type Product = {
  id: string
  name: string
  price: number // in pence
  currency: string
  description?: string
  materials?: string
  care?: string
  sizeChart?: string // free-text size chart/measurements
  limitedEdition?: boolean
  editionNumber?: string // e.g. "1 of 50"
  images: string[] // array of Vercel Blob URLs
  sizes: string[] // e.g. ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  stock: Record<string, number> // size -> qty
  active: boolean
  createdAt: string
}

export type Order = {
  id: string
  cart: Array<{ productId: string; size: string; price: number; productName?: string }>
  shipping: {
    name: string
    email: string
    address: string
    city: string
    postcode: string
    country: string
  }
  total: number
  invoiceId: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  createdAt: string
  paidAt?: string
  shippedAt?: string
}

// Product helpers
export async function getAllProducts(): Promise<Product[]> {
  const keys = await redis.keys('product:*')
  if (keys.length === 0) return []
  const products = await Promise.all(keys.map(k => redis.get<Product>(k)))
  return products.filter((p): p is Product => p !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getActiveProducts(): Promise<Product[]> {
  const all = await getAllProducts()
  return all.filter(p => p.active)
}

export async function getProduct(id: string): Promise<Product | null> {
  return await redis.get<Product>(`product:${id}`)
}

export async function saveProduct(product: Product): Promise<void> {
  await redis.set(`product:${product.id}`, product)
}

export async function deleteProduct(id: string): Promise<void> {
  await redis.del(`product:${id}`)
}

// Order helpers
export async function getAllOrders(): Promise<Order[]> {
  const keys = await redis.keys('order:*')
  if (keys.length === 0) return []
  const orders = await Promise.all(keys.map(k => redis.get<Order>(k)))
  return orders.filter((o): o is Order => o !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getOrder(id: string): Promise<Order | null> {
  return await redis.get<Order>(`order:${id}`)
}

export async function saveOrder(order: Order): Promise<void> {
  await redis.set(`order:${order.id}`, order)
}

// Customer aggregation (grouped by email)
export async function getCustomers() {
  const orders = await getAllOrders()
  const customers = new Map<string, {
    email: string
    name: string
    orders: Order[]
    totalSpent: number
    firstOrder: string
    lastOrder: string
  }>()

  for (const order of orders) {
    const email = order.shipping.email.toLowerCase()
    if (!customers.has(email)) {
      customers.set(email, {
        email,
        name: order.shipping.name,
        orders: [],
        totalSpent: 0,
        firstOrder: order.createdAt,
        lastOrder: order.createdAt,
      })
    }
    const c = customers.get(email)!
    c.orders.push(order)
    if (order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered') {
      c.totalSpent += order.total
    }
    if (new Date(order.createdAt) < new Date(c.firstOrder)) c.firstOrder = order.createdAt
    if (new Date(order.createdAt) > new Date(c.lastOrder)) c.lastOrder = order.createdAt
  }

  return Array.from(customers.values())
    .sort((a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime())
}
