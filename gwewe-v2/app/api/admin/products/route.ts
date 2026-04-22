import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { saveProduct, type Product } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const product: Product = {
    id: nanoid(8).toLowerCase(),
    name: body.name,
    price: body.price || 0,
    currency: 'GBP',
    description: body.description || '',
    materials: body.materials || '',
    care: body.care || '',
    sizeChart: body.sizeChart || '',
    limitedEdition: body.limitedEdition || false,
    editionNumber: body.editionNumber || '',
    images: body.images || [],
    sizes: body.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: body.stock || {},
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
  }

  await saveProduct(product)
  return NextResponse.json({ ok: true, id: product.id })
}
