export default function CTA() {
  return (
    <section id="contact" className="py-20 sm:py-32 bg-gradient-to-r from-primary to-primary/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">Ready to Go Solar?</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Get a free consultation from our solar experts and discover how much you can save.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-white/90 transition-colors font-semibold">
            Schedule Free Consultation
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold">
            Call Us: 1-800-SOLAR-NOW
          </button>
        </div>
      </div>
    </section>
  )
}
