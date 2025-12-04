export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">Premium Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            State-of-the-art technology designed for maximum efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Monitoring",
              desc: "Real-time tracking of your energy production and consumption through our mobile app.",
              icon: "📱",
            },
            {
              title: "Advanced Battery Storage",
              desc: "Store excess energy for use during peak hours or overnight with our Tesla Powerwall integration.",
              icon: "🔋",
            },
            {
              title: "Professional Installation",
              desc: "Certified technicians ensure perfect installation with minimal disruption to your home.",
              icon: "🔧",
            },
          ].map((feature) => (
            <div key={feature.title} className="space-y-4">
              <div className="h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-6xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
