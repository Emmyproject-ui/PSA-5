"use client"

import { GraduationCap, Users, FolderHeart, UserCheck } from "lucide-react"

const impacts = [
  { 
    number: '2,500+', 
    label: 'Students Educated', 
    icon: <GraduationCap className="h-6 w-6" />,
    color: "bg-blue-50 text-blue-600",
    description: "Providing quality education to underserved youth."
  },
  { 
    number: '1,200+', 
    label: 'People Served', 
    icon: <Users className="h-6 w-6" />,
    color: "bg-emerald-50 text-emerald-600",
    description: "Healthcare and support for families in need."
  },
  { 
    number: '50+', 
    label: 'Active Projects', 
    icon: <FolderHeart className="h-6 w-6" />,
    color: "bg-rose-50 text-rose-600",
    description: "Ongoing initiatives across multiple sectors."
  },
  { 
    number: '5,000+', 
    label: 'Volunteers', 
    icon: <UserCheck className="h-6 w-6" />,
    color: "bg-amber-50 text-amber-600",
    description: "A community driven by passion and service."
  }
]

export default function ImpactSection() {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 font-primary">
          <span className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-4 block">Our Global Footprint</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-gray-100 mb-6 tracking-tight transition-colors">
            Measurable <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Impact</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed transition-colors">
            We don&apos;t just talk about change; we deliver it. Every number represents a life transformed and a community strengthened.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <div 
              key={index} 
              className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden font-primary"
            >
              {/* Hover Background Accent */}
              <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className={`h-14 w-14 rounded-2xl ${impact.color} dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                {impact.icon}
              </div>
              
              <p className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-gray-100 mb-2 tracking-tighter tabular-nums transition-colors">
                {impact.number}
              </p>
              <p className="text-lg font-bold text-slate-800 dark:text-gray-200 mb-3 transition-colors">{impact.label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium transition-colors">
                {impact.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
