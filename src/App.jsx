// src/App.jsx
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Portfolio from './components/Portfolio'
import PullQuote from './components/PullQuote'
import About from './components/About'
import Contact from './components/Contact'
import BackToTop from './components/BackToTop'
import CustomCursor from './components/CustomCursor'
import ScrollSkew from './components/ScrollSkew'

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <ScrollSkew>
        <main>
          <Hero />
          <Marquee />
          <Portfolio />
          <PullQuote />
          <About />
          <Contact />
        </main>
      </ScrollSkew>
      <BackToTop />
      <CustomCursor />
    </ThemeProvider>
  )
}
