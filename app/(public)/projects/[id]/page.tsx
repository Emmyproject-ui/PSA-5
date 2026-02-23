import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Users, Target, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const projectsData: Record<
  string,
  {
    id: number
    title: string
    description: string
    category: string
    image: string
    fullDescription: string
    location: string
    beneficiaries: string
    startDate: string
    goals: string[]
    impact: { label: string; value: string }[]
  }
> = {
  "1": {
    id: 1,
    title: "Rural Education Program",
    description: "Providing quality education to underprivileged children in rural areas.",
    category: "Education",
    image: "/rural-classroom-with-children-learning.jpg",
    fullDescription:
      "Our Rural Education Program is dedicated to breaking the cycle of poverty through education. We establish learning centers in remote villages, train local teachers, provide educational materials, and ensure that every child has access to quality primary and secondary education. The program includes after-school tutoring, digital literacy training, and scholarship opportunities for higher education.",
    location: "Rural communities across 12 districts",
    beneficiaries: "5,000+ children annually",
    startDate: "January 2020",
    goals: [
      "Establish 50 new learning centers by 2025",
      "Achieve 95% literacy rate in target communities",
      "Provide scholarships to 500 students for higher education",
      "Train 200 local teachers in modern teaching methods",
    ],
    impact: [
      { label: "Students Enrolled", value: "5,000+" },
      { label: "Learning Centers", value: "35" },
      { label: "Teachers Trained", value: "150" },
      { label: "Graduation Rate", value: "92%" },
    ],
  },
  "2": {
    id: 2,
    title: "Healthcare Outreach",
    description: "Free health camps and medical services in underserved communities.",
    category: "Healthcare",
    image: "/medical-health-camp-with-doctors-and-patients.jpg",
    fullDescription:
      "The Healthcare Outreach program brings essential medical services to communities that lack access to healthcare facilities. We organize mobile health camps, provide free consultations, distribute medicines, and conduct health awareness campaigns. Our team of volunteer doctors, nurses, and healthcare workers travel to remote areas to ensure no one is left behind.",
    location: "Underserved urban and rural areas",
    beneficiaries: "20,000+ patients annually",
    startDate: "March 2019",
    goals: [
      "Conduct 100 health camps annually",
      "Provide free medicines to 25,000 patients",
      "Reduce infant mortality rate by 30% in target areas",
      "Establish 10 permanent health clinics",
    ],
    impact: [
      { label: "Patients Treated", value: "20,000+" },
      { label: "Health Camps", value: "85" },
      { label: "Volunteer Doctors", value: "120" },
      { label: "Lives Saved", value: "500+" },
    ],
  },
  "3": {
    id: 3,
    title: "Community Development",
    description: "Building sustainable livelihood programs for low-income families.",
    category: "Social Welfare",
    image: "/community-center-with-people-working-together.jpg",
    fullDescription:
      "Our Community Development initiative focuses on creating sustainable livelihoods for marginalized families. We provide vocational training, microfinance support, and entrepreneurship development programs. The goal is to empower individuals to become self-sufficient and contribute positively to their communities. We also work on infrastructure development, clean water access, and sanitation facilities.",
    location: "Low-income neighborhoods and villages",
    beneficiaries: "3,000+ families",
    startDate: "June 2018",
    goals: [
      "Train 2,000 individuals in vocational skills",
      "Provide microloans to 500 small businesses",
      "Build 20 community centers",
      "Ensure clean water access for 10,000 households",
    ],
    impact: [
      { label: "Families Supported", value: "3,000+" },
      { label: "Jobs Created", value: "1,200" },
      { label: "Small Businesses", value: "350" },
      { label: "Community Centers", value: "15" },
    ],
  },
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projectsData[id]

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Link href="/projects">
            <Button>View All Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
            >
              <ArrowLeft size={20} />
              Back to Projects
            </Link>
            <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{project.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-4">About This Project</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{project.fullDescription}</p>

            <h3 className="text-xl font-bold text-foreground mb-4">Our Goals</h3>
            <ul className="space-y-3 mb-8">
              {project.goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Target className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">{goal}</span>
                </li>
              ))}
            </ul>

            {/* Impact Stats */}
            <h3 className="text-xl font-bold text-foreground mb-4">Our Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.impact.map((item, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-muted rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Project Details</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium text-foreground">{project.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-muted-foreground">Beneficiaries</div>
                    <div className="font-medium text-foreground">{project.beneficiaries}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-muted-foreground">Started</div>
                    <div className="font-medium text-foreground">{project.startDate}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/donate" className="block">
                  <Button className="w-full bg-accent text-accent-foreground hover:opacity-90">
                    <Heart className="mr-2" size={18} />
                    Support This Project
                  </Button>
                </Link>
                <Link href="/volunteer" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Become a Volunteer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
