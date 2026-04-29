"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Calendar, ArrowRight, Loader2 } from "lucide-react"
import { blogApi } from "@/lib/api"
import { blogPosts as staticPosts } from "@/lib/blog-data"

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await blogApi.getPosts()
        // If API returns posts use them, otherwise fall back to static data
        setPosts(data && data.length > 0 ? data : staticPosts)
      } catch {
        setPosts(staticPosts)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories = ['All', ...Array.from(new Set(posts.map((p: any) => p.category)))]
  const filtered = selectedCategory === 'All' ? posts : posts.filter((p: any) => p.category === selectedCategory)

  return (
    <>
      <main className="min-h-screen pt-24 pb-16 bg-background dark:bg-slate-950 transition-colors">
        <section className="bg-primary text-primary-foreground py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Blog & News</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Stories, updates, and insights from GGNF&apos;s work in the field.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-10 font-primary transition-colors">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-muted-foreground dark:text-gray-400 hover:bg-primary hover:text-primary-foreground border border-border/50 dark:border-slate-800'
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
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No posts in this category yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((post: any) => (
                  <article
                    key={post.id}
                    className="bg-card dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 overflow-hidden group border border-border/50 dark:border-slate-800 flex flex-col h-full font-primary"
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary/95 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          {post.category}
                        </span>
                      </div>
                      {post.gallery && post.gallery.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-medium">
                          +{post.gallery.length - 1} photos
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-muted-foreground dark:text-slate-500 text-xs font-medium mb-3 uppercase tracking-wider transition-colors">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-card-foreground dark:text-gray-100 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground dark:text-gray-400 mb-6 line-clamp-3 text-sm flex-grow transition-colors">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all mt-auto"
                      >
                        Read full story
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
