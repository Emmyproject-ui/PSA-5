"use client"

import { useEffect, useRef, useState } from 'react'
import AdminLayout from '@/components/admin-layout'
import { projectApi } from '@/lib/api'
import { useRouter, useParams } from 'next/navigation'
import { Loader2, ArrowLeft, Image as ImageIcon, X } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['Education', 'Healthcare', 'Social Welfare', 'Environment', 'General']

export default function ProjectFormPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params?.id === 'new'
  const projectId = isNew ? null : Number(params?.id)

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('General')
  const [description, setDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [published, setPublished] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isNew) return
    const load = async () => {
      try {
        const projects = await projectApi.adminGetProjects()
        const project = projects.find((p: any) => p.id === projectId)
        if (project) {
          setTitle(project.title)
          setCategory(project.category || 'General')
          setDescription(project.description || '')
          setFullDescription(project.full_description || '')
          setPublished(project.published)
          setImagePreview(project.image || null)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isNew, projectId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true); setError(null)
    try {
      const form = new FormData()
      form.append('title', title)
      form.append('category', category)
      form.append('description', description)
      form.append('full_description', fullDescription)
      form.append('published', published ? '1' : '0')
      if (imageFile) form.append('image', imageFile)

      if (isNew) {
        await projectApi.createProject(form)
      } else {
        await projectApi.updateProject(projectId!, form)
      }
      router.push('/admin/projects')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Project">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={isNew ? 'New Project' : 'Edit Project'}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/projects" className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 dark:text-gray-100">
            {isNew ? 'Add New Project' : 'Edit Project'}
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4">
            <h2 className="font-semibold text-slate-700 dark:text-gray-300 text-sm uppercase tracking-wider">Project Details</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Project title..."
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100 text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100 text-sm"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Status</label>
                <select
                  value={published ? 'published' : 'draft'}
                  onChange={e => setPublished(e.target.value === 'published')}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100 text-sm"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Short Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary shown in the project card..."
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Full Description</label>
              <textarea
                value={fullDescription}
                onChange={e => setFullDescription(e.target.value)}
                rows={6}
                placeholder="Detailed description of the project..."
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100 text-sm resize-y"
              />
            </div>
          </div>

          {/* Image */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="font-semibold text-slate-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-4">Project Image</h2>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null) }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
                <button type="button" onClick={() => imageRef.current?.click()} className="mt-3 text-sm text-primary font-medium hover:underline">
                  Change image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary transition-colors"
              >
                <ImageIcon size={28} />
                <span className="text-sm font-medium">Click to upload project image</span>
                <span className="text-xs">PNG, JPG, WebP up to 5MB</span>
              </button>
            )}
            <input ref={imageRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          <div className="flex items-center gap-3 pb-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 text-sm"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {isNew ? 'Add Project' : 'Save Changes'}
            </button>
            <Link href="/admin/projects" className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-gray-200 font-medium text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
