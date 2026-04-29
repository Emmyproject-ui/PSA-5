"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag, Images, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { blogApi } from "@/lib/api"
import { getBlogPostBySlug, blogPosts as staticPosts } from "@/lib/blog-data"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<any>(null)
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      try {
        // Try API first
        const apiPost = await blogApi.getPost(slug)
        if (apiPost) {
          setPost(apiPost)
          const all = await blogApi.getPosts()
          setAllPosts(all && all.length > 0 ? all : staticPosts)
        } else {
          throw new Error('not found')
        }
      } catch {
        // Fallback to static data
        const staticPost = getBlogPostBySlug(slug)
        if (staticPost) {
          setPost(staticPost)
          setAllPosts(staticPosts)
        } else {
          setNotFound(true)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </>
    )
  }

  if (notFound || !post) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Post not found</h1>
          <Link href="/blog" className="text-primary font-semibold hover:underline">← Back to Blog</Link>
        </div>
      </>
    )
  }

  const contentParagraphs = (post.content || '').split("\n\n").filter((p: string) => p.trim())
  const gallery = post.gallery || []
  const relatedPosts = allPosts.filter((p: any) => p.id !== post.id && p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative h-[400px] md:h-[500px]">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Link>
              <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{post.date}</span>
                {gallery.length > 1 && (
                  <span className="flex items-center gap-2"><Images className="h-4 w-4" />{gallery.length} photos</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-medium">{post.excerpt}</p>
              )}
              {contentParagraphs.map((paragraph: string, index: number) => (
                <p key={index} className="text-foreground leading-relaxed text-lg mb-6">{paragraph}</p>
              ))}
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <Images className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Photo Gallery</h2>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{gallery.length} photos</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map((image: string, index: number) => (
                    <div key={index} className={`overflow-hidden rounded-lg shadow-md ${index === 0 ? "md:col-span-2" : ""}`}>
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${post.title} - Image ${index + 1}`}
                        className={`w-full object-cover hover:scale-105 transition duration-300 ${index === 0 ? "h-80 md:h-[400px]" : "h-64 md:h-80"}`}
                        onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-primary font-semibold">{post.category}</span>
                </div>
                <div className="flex gap-4">
                  <Link href="/donate" className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition">Support Our Work</Link>
                  <Link href="/volunteer" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition">Volunteer</Link>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-foreground mb-6">More Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost: any) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                      <div className="bg-card rounded-lg shadow-md overflow-hidden">
                        <img
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                          onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                        />
                        <div className="p-4">
                          <span className="text-xs text-primary font-semibold">{relatedPost.category}</span>
                          <h3 className="text-sm font-bold text-card-foreground mt-1 line-clamp-2 group-hover:text-primary transition">{relatedPost.title}</h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
