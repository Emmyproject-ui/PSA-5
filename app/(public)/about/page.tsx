import { Heart, BookOpen, Users, Lightbulb } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center font-primary">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-gray-100 mb-4 transition-colors">About GGNF Foundation</h1>
          <p className="text-xl text-muted-foreground dark:text-slate-400 text-balance transition-colors">
            Good God Never Fails – Transforming lives through love, compassion, and opportunity
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto font-primary">
          <h2 className="text-3xl font-bold text-foreground dark:text-gray-100 mb-6 transition-colors">Who We Are</h2>
          <div className="space-y-4 text-muted-foreground dark:text-slate-400 leading-relaxed transition-colors">
            <p>
              GGNF Foundation (Good God Never Fails) is a child-focused humanitarian organization committed to
              transforming lives with love, compassion, and opportunity. We believe every child carries a spark of
              greatness and, with the right support, guidance, and encouragement, that spark can become a bright future.
            </p>
            <p>
              Our work is rooted in the belief that no child should ever feel unseen, unheard, or unsupported. Through
              targeted programs, community outreach, and sustainable empowerment initiatives, we are building a world
              where children can learn, grow, and thrive—regardless of their background or circumstances.
            </p>
            <p>
              At GGNF, we stand on faith, compassion, and the conviction that Good God Never Fails. Therefore,
              children should never be allowed to fail for lack of love or opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto font-primary">
          <h2 className="text-3xl font-bold text-foreground dark:text-gray-100 mb-6 transition-colors">Our Purpose</h2>
          <div className="space-y-4 text-muted-foreground dark:text-slate-400 leading-relaxed transition-colors">
            <p>
              We exist to bring hope, care, and possibility into the lives of vulnerable children. Whether it&apos;s
              providing basic needs, educational support, emotional encouragement, or community-driven empowerment, our
              mission is simple:
            </p>
            <p className="text-xl font-semibold text-primary italic text-center py-4 transition-transform duration-300 hover:scale-105">
              To help every child feel valued, supported, and empowered to realize their full potential.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto font-primary">
          <h2 className="text-3xl font-bold text-foreground dark:text-gray-100 mb-8 text-center transition-colors">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-card dark:bg-slate-900 rounded-lg p-6 shadow-sm border dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-none hover:border-primary/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Heart className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" aria-label="Heart icon" />
                </div>
                <h3 className="text-xl font-bold text-foreground dark:text-gray-100 transition-colors duration-300 group-hover:text-primary">Child Support & Welfare</h3>
              </div>
              <p className="text-muted-foreground dark:text-slate-400 leading-relaxed transition-colors">
                We reach out to children facing hardship, offering essentials such as food, clothing, medical support,
                and safe spaces.
              </p>
            </div>

            <div className="group bg-card dark:bg-slate-900 rounded-lg p-6 shadow-sm border dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-none hover:border-secondary/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-secondary/20 group-hover:scale-110">
                  <BookOpen className="w-6 h-6 text-secondary transition-transform duration-300 group-hover:scale-110" aria-label="Book Open icon" />
                </div>
                <h3 className="text-xl font-bold text-foreground dark:text-gray-100 transition-colors duration-300 group-hover:text-secondary">Educational Empowerment</h3>
              </div>
              <p className="text-muted-foreground dark:text-slate-400 leading-relaxed transition-colors">
                We support children&apos;s academic growth through school supplies, scholarships, mentorship, and learning
                programs that open doors to brighter futures.
              </p>
            </div>

            <div className="group bg-card rounded-lg p-6 shadow-sm border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                  <Users className="w-6 h-6 text-accent transition-transform duration-300 group-hover:scale-110" aria-label="Users icon" />
                </div>
                <h3 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-accent">Community Outreach</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We collaborate with communities and volunteers to uplift families, strengthen support systems, and
                create lasting positive impact.
              </p>
            </div>

            <div className="group bg-card dark:bg-slate-900 rounded-lg p-6 shadow-sm border dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-none hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Lightbulb className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" aria-label="Lightbulb icon" />
                </div>
                <h3 className="text-xl font-bold text-foreground dark:text-gray-100 transition-colors duration-300 group-hover:text-primary">Faith & Inspiration</h3>
              </div>
              <p className="text-muted-foreground dark:text-slate-400 leading-relaxed transition-colors">
                Our foundation is guided by the belief that God&apos;s love restores and elevates. We work with compassion
                and faith, giving children hope beyond their current circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto font-primary transition-colors">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border-l-4 border-l-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none hover:border-l-primary">
              <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
              <p className="text-muted-foreground dark:text-slate-400 leading-relaxed transition-colors">
                To build a world where every child, regardless of background, grows up feeling loved, valued, supported,
                and empowered to reach their full potential.
              </p>
            </div>

            <div className="group bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border-l-4 border-l-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none hover:border-l-secondary">
              <h2 className="text-2xl font-bold text-secondary mb-4">Our Mission</h2>
              <p className="text-muted-foreground dark:text-slate-400 leading-relaxed transition-colors">
                To transform children&apos;s lives through compassion-driven support, education, and empowerment initiatives.
                We are committed to providing care, resources, and opportunities that help every child discover their
                inner greatness—knowing that with love and faith, Good God Never Fails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto font-primary">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground dark:text-gray-100 mb-2 transition-colors">The Founder</h2>
            <h3 className="text-2xl font-semibold text-primary">Henry Opara Chidubem</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
              <div className="group w-64 sm:w-72 md:w-full max-w-sm overflow-hidden rounded-xl border dark:border-slate-800 bg-card dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1">
                <Image
                  src="/images/founder.png"
                  alt="Henry Opara Chidubem – Founder of GGNF Foundation"
                  width={600}
                  height={800}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 space-y-4 text-muted-foreground dark:text-slate-400 leading-relaxed font-primary transition-colors">
              <p>
                Henry Opara Chidubem is an entrepreneur, techpreneur, and philanthropist with a deep passion for humanity
                and child empowerment. Guided by the scripture John 9:5, Henry believes in being a light in the world
                (especially to those who need it most).
              </p>
              <p>
                With a strong background in business, technology, and community development, Henry has dedicated himself
                to using his influence and resources to uplift others. His philanthropic journey led to the birth of
                GGNF Foundation—a platform through which he channels his commitment to giving children love, support,
                and opportunities to succeed.
              </p>
              <p>
                Beyond the foundation, Henry also manages Andreams Homes and continues to inspire thousands online
                through his leadership, compassion, and unwavering faith that Good God Never Fails.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
