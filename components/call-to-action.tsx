import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-secondary to-blue-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
          Whether you want to donate, volunteer, or simply learn more about our work, we welcome you to join our mission.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/donate"
            className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Donate Now
          </Link>
          <Link
            href="/volunteer"
            className="bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition border border-white/40"
          >
            Volunteer With Us
          </Link>
        </div>
      </div>
    </section>
  )
}
