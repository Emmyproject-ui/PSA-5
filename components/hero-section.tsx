"use client"

import Link from "next/link"
import { ArrowRight, Play, Heart } from "lucide-react"

export default function HeroSection() {
  const videoUrl = 'https://media.gettyimages.com/id/667562721/de/video/january-2015-saw-a-three-day-period-of-excessive-rain-which-brought-unprecedented-floods-to.mp4?s=mp4-480x480-gi&k=20&c=rY0Vi-u1-e2xo1t1JtGV3rZM0WsBf34AQoUNXNi7NJI='

  return (
    <section className="relative w-full h-[90svh] min-h-[700px] overflow-hidden flex items-center bg-slate-900">
      {/* Cinematic Background Video with better Masking */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Modern Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />

      {/* Floating UI Elements for Polish - REMOVED for public view as per requirements */}

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md mb-8 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-primary-foreground">Good God Never Fails</span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-white drop-shadow-2xl">
            Igniting <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Hope</span>, <br />
            Building <span className="italic">Futures</span>
          </h1>
          
          <p className="text-lg md:text-2xl mb-12 text-slate-200/90 max-w-2xl leading-relaxed text-balance">
            We are a global community dedicated to breaking the cycle of poverty through education, healthcare, and sustainable social welfare programs.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/projects"
              className="group relative inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Our Work <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-3 text-white font-bold text-lg hover:text-primary transition-all group w-full sm:w-auto"
            >
              <div className="h-14 w-14 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
                <Play size={20} fill="currentColor" />
              </div>
              Support Us
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce cursor-pointer">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Scroll</span>
        <div className="h-6 w-[2px] bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  )
}
