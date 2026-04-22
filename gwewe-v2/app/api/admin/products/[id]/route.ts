import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getProduct, saveProduct, deleteProduct } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await getProduct(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  await saveProduct({
    ...existing,
    ...body,
    id,
    createdAt: existing.createdAt,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await deleteProduct(id)
  return NextResponse.json({ ok: true })
}
