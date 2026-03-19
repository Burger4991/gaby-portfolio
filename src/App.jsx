// src/App.jsx
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import About from './components/About'
import Contact from './components/Contact'

export default function App() {
  return (
    <ThemeProvider>
      <main>
        <Navbar />
        <Hero />
        <Portfolio />
        <About />
        <Contact />
      </main>
    </ThemeProvider>
  )
}
