"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin-layout'
import { projectApi } from '@/lib/api'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Loader2, FolderKanban } from 'lucide-react'

interface Project {
  id: number
  title: string
  category: string
  description: string
  published: boolean
  image: string | null
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const data = await projectApi.adminGetProjects()
      setProjects(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    setDeleting(id)
    try {
      await projectApi.deleteProject(id)
      setProjects(p => p.filter(proj => proj.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  return (
    <AdminLayout title="Projects">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderKanban className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100">Projects</h1>
            <p className="text-sm text-slate-500">{projects.length} projects total</p>
          </div>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <FolderKanban className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">No projects yet</h3>
          <p className="text-slate-400 text-sm mb-6">Add your first project to get started</p>
          <Link href="/admin/projects/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Add First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <FolderKanban className="h-12 w-12 text-slate-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{project.category}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${project.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-gray-200 text-sm mb-1 line-clamp-1">{project.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{project.description}</p>
                <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === project.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
