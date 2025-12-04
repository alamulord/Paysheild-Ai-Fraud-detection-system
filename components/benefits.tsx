import { Zap, Leaf, DollarSign, TrendingUp } from "lucide-react"

const benefits = [
  {
    icon: DollarSign,
    title: "Save Up to 80%",
    description: "Dramatically reduce your monthly energy bills with our high-efficiency solar systems.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Eliminate carbon footprint and contribute to a cleaner, sustainable environment.",
  },
  {
    icon: Zap,
    title: "Reliable Power",
    description: "Advanced battery storage ensures uninterrupted power supply even during grid outages.",
  },
  {
    icon: TrendingUp,
    title: "Increase Home Value",
    description: "Solar installations increase property values by an average of 4.1%.",
  },
]

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">Why Choose Solar Energy?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of homeowners saving money and protecting the planet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
