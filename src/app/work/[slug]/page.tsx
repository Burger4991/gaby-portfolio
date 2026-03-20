import { notFound } from 'next/navigation'
import { categories } from '@/data/portfolioData'
import SplitScrollCollection from '@/components/SplitScrollCollection'
import Navbar from '@/components/Navbar'

export const dynamicParams = false

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.id }))
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categories.find((c) => c.id === slug)
  if (!category) notFound()
  return (
    <>
      <Navbar />
      <SplitScrollCollection category={category} />
    </>
  )
}
