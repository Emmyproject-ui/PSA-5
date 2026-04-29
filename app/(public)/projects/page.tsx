'use client'

import Footer from "@/components/footer"
import { useState, useEffect } from 'react'
import { projectApi } from "@/lib/api"
import { Loader2 } from "lucide-react"

// Static fallback data
const staticProjects = [
  { id: 1, title: 'Rural Education Program', category: 'Education', description: 'Providing quality education to underprivileged children in rural areas.', image: '/rural-classroom.jpg', full_description: 'Our Rural Education Program aims to provide quality education to children in remote areas.' },
  { id: 2, title: 'Healthcare Outreach', category: 'Healthcare', description: 'Free health camps and medical services in underserved communities.', image: '/medical-clinic.png', full_description: 'Regular health camps offering free medical check-ups and health awareness programs.' },
  { id: 3, title: 'Community Development', category: 'Social Welfare', description: 'Building sustainable livelihood programs for low-income families.', image: '/vibrant-community-center.png', full_description: 'We work with communities to create sustainable livelihood opportunities.' },
  { id: 4, title: 'Environmental Conservation', category: 'Environment', description: 'Tree plantation and environmental awareness initiatives.', image: '/environmental-conservation.jpg', full_description: 'Our environmental programs focus on tree plantation and sustainable practices.' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await projectApi.getProjects()
        setProjects(data && data.length > 0 ? data : staticProjects)
      } catch {
        setProjects(staticProjects)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories = ['All', ...Array.from(new Set(projects.map((p: any) => p.category)))]
  const filteredProjects = selectedCategory === 'All' ? projects : projects.filter(p => p.category === selectedCategory)

  return (
    <>
      <main className="min-h-screen pt-24 pb-16 bg-background dark:bg-slate-950 transition-colors">
        <section className="bg-primary text-white py-12 md:py-16 font-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Projects</h1>
            <p className="text-lg text-white/90">Discover the initiatives making real differences in communities.</p>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-12 font-primary">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-muted dark:bg-slate-900 text-foreground dark:text-gray-300 hover:bg-muted/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg dark:shadow-none border dark:border-slate-800 transition overflow-hidden font-primary">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                    />
                    <div className="p-6">
                      <span className="inline-block bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-bold text-foreground dark:text-gray-100 mb-2 transition-colors">{project.title}</h3>
                      <p className="text-muted-foreground dark:text-gray-400 mb-4 transition-colors">{project.description}</p>
                      {project.full_description && (
                        <p className="text-sm text-muted-foreground dark:text-gray-500 transition-colors italic">{project.full_description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
