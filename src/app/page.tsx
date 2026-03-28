import Preloader from '@/components/Preloader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import HomeSnap from '@/components/HomeSnap'
import BackToTop from '@/components/BackToTop'

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <HomeSnap />
      </main>
      <BackToTop />
    </>
  )
}
