import Preloader from '@/components/Preloader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import HomeSections from '@/components/HomeSections'
import BackToTop from '@/components/BackToTop'

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <HomeSections />
      </main>
      <BackToTop />
    </>
  )
}
