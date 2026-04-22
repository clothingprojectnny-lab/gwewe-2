import { getProduct } from '@/lib/db'
import { notFound } from 'next/navigation'
import ProductForm from '../ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()
  return <ProductForm product={product} />
}
