import Link from "next/link"

const projects = [
  {
    id: 1,
    title: "Rural Education Program",
    description: "Providing quality education to underprivileged children in rural areas.",
    category: "Education",
    image: "/rural-classroom-with-children-learning.jpg",
  },
  {
    id: 2,
    title: "Healthcare Outreach",
    description: "Free health camps and medical services in underserved communities.",
    category: "Healthcare",
    image: "/medical-health-camp.jpg",
  },
  {
    id: 3,
    title: "Community Development",
    description: "Building sustainable livelihood programs for low-income families.",
    category: "Social Welfare",
    image: "/community-center-development.jpg",
  },
]

export default function FeaturedProjects() {
  return (
    <section className="py-16 md:py-24 bg-muted dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 font-primary">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-gray-100 mb-4 transition-colors">Featured Projects</h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto transition-colors">
            Discover the initiatives making real differences in people's lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-slate-950 rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-none dark:border dark:border-slate-800 transition font-primary">
              <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="inline-block bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold mb-3 transition-colors">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-foreground dark:text-gray-100 mb-2 transition-colors">{project.title}</h3>
                <p className="text-muted-foreground dark:text-gray-400 mb-4 transition-colors">{project.description}</p>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
