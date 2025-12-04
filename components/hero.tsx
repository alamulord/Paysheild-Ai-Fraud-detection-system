export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block bg-accent/10 border border-accent/20 rounded-full px-4 py-2">
              <span className="text-sm font-medium text-primary">☀️ Renewable Energy Solutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Power Your Future With <span className="text-primary">Clean Solar Energy</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Harness the sun&apos;s unlimited power. Reduce your energy bills by up to 80% while contributing to a
              sustainable planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Start Free Consultation
              </button>
              <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors font-medium">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-primary/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3v1m0 16v1m9-9h-1m-16 0H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="text-primary/60 font-medium">Solar Energy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl -z-10" />
    </section>
  )
}
