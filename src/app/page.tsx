import Preloader from '@/components/Preloader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Portfolio from '@/components/Portfolio'
import PullQuote from '@/components/PullQuote'
import About from '@/components/About'
import Contact from '@/components/Contact'
import BackToTop from '@/components/BackToTop'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Portfolio />
        <PullQuote />
        <About />
        <Contact />
      </main>
      <BackToTop />
      <CustomCursor />
    </>
  )
}
