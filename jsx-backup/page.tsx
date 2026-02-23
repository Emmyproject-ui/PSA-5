import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import ImpactSection from '@/components/impact-section'
import FeaturedProjects from '@/components/featured-projects'
import CallToAction from '@/components/call-to-action'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <HeroSection />
        <ImpactSection />
        <FeaturedProjects />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
