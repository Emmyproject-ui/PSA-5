'use client'

import Footer from "@/components/footer"
import { useState } from 'react'

const allProjects = [
  {
    id: 1,
    title: 'Rural Education Program',
    category: 'Education',
    description: 'Providing quality education to underprivileged children in rural areas. We build schools and provide scholarships.',
    image: '/rural-classroom.jpg',
    fullDescription: 'Our Rural Education Program aims to provide quality education to children in remote areas who lack access to proper schooling. We build infrastructure, train teachers, and provide learning materials.'
  },
  {
    id: 2,
    title: 'Healthcare Outreach',
    category: 'Healthcare',
    description: 'Free health camps and medical services in underserved communities.',
    image: '/medical-clinic.png',
    fullDescription: 'Regular health camps offering free medical check-ups, medicines, and health awareness programs to underserved communities.'
  },
  {
    id: 3,
    title: 'Community Development',
    category: 'Social Welfare',
    description: 'Building sustainable livelihood programs for low-income families.',
    image: '/vibrant-community-center.png',
    fullDescription: 'We work with communities to create sustainable livelihood opportunities through skill training and microfinance support.'
  },
  {
    id: 4,
    title: 'Environmental Conservation',
    category: 'Environment',
    description: 'Tree plantation and environmental awareness initiatives.',
    image: '/environmental-conservation.jpg',
    fullDescription: 'Our environmental programs focus on tree plantation, waste management, and promoting sustainable practices.'
  },
]

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const categories = ['All', 'Education', 'Healthcare', 'Social Welfare', 'Environment']
  const filteredProjects = selectedCategory === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === selectedCategory)

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

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg dark:shadow-none border dark:border-slate-800 transition overflow-hidden font-primary">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="inline-block bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground dark:text-gray-100 mb-2 transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground dark:text-gray-400 mb-4 transition-colors">{project.description}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-500 transition-colors italic">{project.fullDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
