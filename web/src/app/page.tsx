import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <main>
      <Header />

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900 via-forest-900 to-forest-950" />
        {/* Subtle radial glow */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/30 blur-3xl" />
        </div>

        <div className="relative z-10 container-wide text-center pt-24 pb-16">
          <p className="text-gold-400 text-sm uppercase tracking-[0.3em] mb-6 font-semibold">
            Premium Cannabis
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-8">
            <span>Elevate Your</span>
            <br />
            <span className="text-gold-gradient">Standard</span>
          </h1>
          <p className="max-w-xl mx-auto text-white/60 text-lg mb-12 leading-relaxed">
            Meticulously cultivated. Scientifically tested. Crafted for those who demand the cleanest, most consistent cannabis experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#products"
              className="btn-primary shadow-glow"
            >
              Explore Collection
            </a>
            <a
              href="#about"
              className="btn-outline"
            >
              Our Story
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/30">
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section id="products" className="bg-forest-950 py-24 md:py-32">
        <div className="container-wide">
          <p className="text-gold-400 text-xs uppercase tracking-[0.3em] text-center mb-4 font-semibold">
            Why DankOS
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-16">
            Built Different. <span className="text-emerald-gradient">Proven Better.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Lab Tested */}
            <div className="group bg-forest-900/60 border border-white/5 rounded-xl p-8 md:p-10 hover:border-emerald-500/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-white mb-3">Lab Tested</h3>
              <p className="text-white/50 leading-relaxed">
                Every batch undergoes third-party cannabinoid and terpene profiling. Full transparency via QR-accessed certificates of analysis.
              </p>
            </div>

            {/* Premium Cultivation */}
            <div className="group bg-forest-900/60 border border-white/5 rounded-xl p-8 md:p-10 hover:border-gold-400/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center mb-6 group-hover:bg-gold-400/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold-400">
                  <path d="M12 22V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 8c-2-4 0-6 0-6s4 2 2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8c2-4 0-6 0-6s-4 2-2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12c-3-3-1-6-1-6s3 2 1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12c3-3 1-6 1-6s-3 2-1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16c-4-3-2-7-2-7s4 2 2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16c4-3 2-7 2-7s-4 2-2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-white mb-3">Premium Cultivation</h3>
              <p className="text-white/50 leading-relaxed">
                Indoor-grown in climate-controlled environments using organic nutrients. No pesticides, no shortcuts — just pure plant potential.
              </p>
            </div>

            {/* Clean Experience */}
            <div className="group bg-forest-900/60 border border-white/5 rounded-xl p-8 md:p-10 hover:border-forest-400/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-forest-400/10 flex items-center justify-center mb-6 group-hover:bg-forest-400/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-forest-300">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-white mb-3">Clean Experience</h3>
              <p className="text-white/50 leading-relaxed">
                Solvent-free extraction, clean concentrates, and minimal-input processing. What the plant gives, nothing artificial adds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────── */}
      <section id="about" className="bg-forest-900 py-24 md:py-32">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-gold-400 text-xs uppercase tracking-[0.3em] mb-4 font-semibold">
                The Origin
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-8">
                Born from science.
                <br />
                Built for wellness.
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                DankOS started with a simple belief: cannabis deserves the same rigor and refinement as any premium consumer category. Our team of botanists, chemists, and cultivators work in tandem to deliver products that are consistent, clean, and potent.
              </p>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                Every strain is selected for its unique terpene profile. Every extract is refined to preserve its full spectrum. Every package is designed for the modern connoisseur.
              </p>
              <a href="#science" className="btn-primary inline-flex">
                Our Science
              </a>
            </div>

            {/* Decorative grid / image placeholder */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-forest-800 to-forest-900 border border-white/5 overflow-hidden">
                {/* Decorative SVG illustration */}
                <svg viewBox="0 0 400 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1B5E20" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#fcd34d" />
                    </linearGradient>
                  </defs>
                  {/* Background pattern */}
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  </pattern>
                  <rect width="400" height="500" fill="url(#grid)" />
                  {/* Large leaf */}
                  <path d="M200 80C200 80 240 140 240 200C240 240 200 280 200 320C200 280 160 240 160 200C160 140 200 80 200 80Z" fill="url(#leafGrad)" opacity="0.8" />
                  <path d="M200 120C200 120 270 160 290 220C300 250 280 300 260 320C270 280 250 230 230 190C210 150 200 120 200 120Z" fill="#10B981" opacity="0.6" />
                  <path d="M200 120C200 120 130 160 110 220C100 250 120 300 140 320C130 280 150 230 170 190C190 150 200 120 200 120Z" fill="#10B981" opacity="0.6" />
                  <path d="M200 200C200 200 260 220 270 260C275 280 260 310 245 315C250 290 240 255 225 230C210 205 200 200 200 200Z" fill="url(#goldGrad)" opacity="0.7" />
                  <path d="M200 200C200 200 140 220 130 260C125 280 140 310 155 315C150 290 160 255 175 230C190 205 200 200 200 200Z" fill="url(#goldGrad)" opacity="0.7" />
                  {/* Stem */}
                  <path d="M198 320L200 400L202 320" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                  {/* Accent dots */}
                  <circle cx="80" cy="120" r="3" fill="#D4AF37" opacity="0.4" />
                  <circle cx="320" cy="180" r="2" fill="#10B981" opacity="0.5" />
                  <circle cx="100" cy="350" r="2" fill="#D4AF37" opacity="0.3" />
                  <circle cx="310" cy="400" r="3" fill="#10B981" opacity="0.4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust / Stats ──────────────────────────── */}
      <section id="science" className="bg-forest-950 py-24 md:py-32">
        <div className="container-wide">
          <p className="text-gold-400 text-xs uppercase tracking-[0.3em] text-center mb-4 font-semibold">
            By the Numbers
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-16">
            Trust, Measured
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "100%", label: "Batch Tested" },
              { value: "12+", label: "Strain Varieties" },
              { value: "3rd", label: "Party Certified" },
              { value: "0", label: "Pesticides Used" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl md:text-5xl text-gold-gradient mb-2">
                  {stat.value}
                </p>
                <p className="text-white/40 text-sm uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-forest-800 to-forest-900 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-gold-400 blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative z-10 container-wide text-center">
          <h2 className="font-display text-3xl md:text-5xl text-white mb-6">
            Ready to Elevate?
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto mb-10">
            Join the community that chooses consistency, purity, and premium quality in every experience.
          </p>
          <a
            href="#contact"
            className="btn-gold shadow-gold inline-flex"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* ── Contact Section ────────────────────────── */}
      <section id="contact" className="bg-forest-900 py-24 md:py-32">
        <div className="container-wide max-w-xl mx-auto text-center">
          <p className="text-gold-400 text-xs uppercase tracking-[0.3em] mb-4 font-semibold">
            Reach Out
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-8">
            We&apos;re Listening
          </h2>
          <form
            action="#"
            method="post"
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Your email"
              required
              className="w-full px-6 py-3 rounded-full bg-forest-950 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            />
            <textarea
              placeholder="Your message"
              rows={4}
              className="w-full px-6 py-3 rounded-xl bg-forest-950 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
            />
            <button type="submit" className="btn-primary mt-2">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
