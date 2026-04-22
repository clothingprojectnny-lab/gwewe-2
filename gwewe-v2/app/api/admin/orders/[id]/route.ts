import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getOrder, saveOrder } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await getOrder(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updates = await request.json()
  const updated = { ...existing, ...updates }

  // Auto-timestamp on status transitions
  if (updates.status === 'paid' && !existing.paidAt) updated.paidAt = new Date().toISOString()
  if (updates.status === 'shipped' && !existing.shippedAt) updated.shippedAt = new Date().toISOString()

  await saveOrder(updated)
  return NextResponse.json({ ok: true })
}
