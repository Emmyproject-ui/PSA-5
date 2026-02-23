import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem forceTheme="system">
      <Navigation />
      <main className="min-h-screen overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  )
}
