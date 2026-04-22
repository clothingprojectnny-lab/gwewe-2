import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { saveOrder, getProduct, type Order } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { cart, shipping, total } = await request.json()

  const orderId = nanoid(10).toUpperCase()

  const enrichedCart = await Promise.all(
    cart.map(async (item: any) => {
      const product = await getProduct(item.productId)
      return {
        ...item,
        productName: product?.name || item.productId,
      }
    })
  )

  const btcpayRes = await fetch(
    `${process.env.BTCPAY_URL}/api/v1/stores/${process.env.BTCPAY_STORE_ID}/invoices`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${process.env.BTCPAY_API_KEY}`,
      },
      body: JSON.stringify({
        amount: (total / 100).toFixed(2),
        currency: 'USD',
        metadata: {
          orderId,
          buyerName: shipping.name,
          buyerEmail: shipping.email,
        },
        checkout: {
          redirectURL: `${process.env.NEXT_PUBLIC_URL}/order/${orderId}`,
          redirectAutomatically: true,
        },
      }),
    }
  )

  if (!btcpayRes.ok) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }

  const invoice = await btcpayRes.json()

  const order: Order = {
    id: orderId,
    cart: enrichedCart,
    shipping,
    total,
    invoiceId: invoice.id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  await saveOrder(order)

  return NextResponse.json({ invoiceUrl: invoice.checkoutLink, orderId })
}
