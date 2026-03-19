export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[#FAF7F2]/90 backdrop-blur-sm">
      <span style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl font-semibold tracking-widest text-[#1C1917]">
        GABY
      </span>
      <div className="flex gap-8 text-sm font-medium tracking-wide text-[#78716C]">
        <a href="#portfolio" className="hover:text-[#C4704A] transition-colors duration-200 cursor-pointer">Work</a>
        <a href="#about" className="hover:text-[#C4704A] transition-colors duration-200 cursor-pointer">About</a>
        <a href="#contact" className="hover:text-[#C4704A] transition-colors duration-200 cursor-pointer">Contact</a>
      </div>
    </nav>
  )
}
