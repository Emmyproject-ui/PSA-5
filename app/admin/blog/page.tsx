"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin-layout'
import { blogApi } from '@/lib/api'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, BookOpen } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  date: string
  published: boolean
  image: string | null
  deleted_at: string | null
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const data = await blogApi.adminGetPosts()
      setPosts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(id)
    try {
      await blogApi.deletePost(id)
      setPosts(p => p.filter(post => post.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  return (
    <AdminLayout title="Blog Posts">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100">Blog Posts</h1>
            <p className="text-sm text-slate-500">{posts.length} posts total</p>
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">No blog posts yet</h3>
          <p className="text-slate-400 text-sm mb-6">Create your first post to get started</p>
          <Link href="/admin/blog/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Create First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Post</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="h-12 w-16 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="h-12 w-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-gray-200 truncate max-w-[200px]">{post.title}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="inline-block bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">{post.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">{post.date}</td>
                  <td className="px-6 py-4">
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Eye size={11} /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <EyeOff size={11} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === post.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
