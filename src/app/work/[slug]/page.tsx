import { notFound } from 'next/navigation'
import { categories } from '@/data/portfolioData'
import CollectionPage from '@/components/CollectionPage'
import Navbar from '@/components/Navbar'

export const dynamicParams = false

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.id }))
}

export default async function CollectionRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categories.find((c) => c.id === slug)
  if (!category) notFound()
  return (
    <>
      <Navbar />
      <CollectionPage category={category} />
    </>
  )
}
