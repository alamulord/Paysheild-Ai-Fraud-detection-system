import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner, California",
    text: "SolarMax transformed my home energy. My bills dropped by 75% in the first month! The team was professional and the installation was seamless.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Small Business Owner, Texas",
    text: "Switching to solar was the best investment for my business. Not only am I saving money, but customers appreciate our commitment to sustainability.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Family of 4, Florida",
    text: "The entire experience was excellent. From consultation to installation to ongoing support, SolarMax handled everything with care.",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">Loved by Our Customers</h2>
          <p className="text-lg text-muted-foreground">See what real customers have to say about their solar journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="p-8 rounded-xl bg-card border border-border">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">{testimonial.text}</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
