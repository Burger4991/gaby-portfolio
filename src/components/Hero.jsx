export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-8">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.3em] text-[#C4704A] uppercase mb-4">Fashion Designer</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-7xl md:text-9xl font-light text-[#1C1917] leading-none mb-6">
          Gaby
        </h1>
        <p className="text-[#78716C] text-lg max-w-md mx-auto leading-relaxed">
          Resort wear, sketches, and everything in between.
        </p>
        <a href="#portfolio" className="inline-block mt-10 px-8 py-3 border border-[#C4704A] text-[#C4704A] text-sm tracking-widest uppercase hover:bg-[#C4704A] hover:text-white transition-colors duration-300 cursor-pointer">
          View Work
        </a>
      </div>
    </section>
  )
}
