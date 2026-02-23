"use client"

import type React from "react"

import { useState } from "react"
import toast from "react-hot-toast"
import { customerApi } from "@/lib/api"

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interests: [] as string[],
    availability: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckbox = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Notify Backend via Service Layer
    try {
      const payload = {
        ...formData,
        skills: formData.interests.join(', '), // Map interests to skills
      };
      await customerApi.volunteer(payload);
      setSubmitted(true)
      toast.success("Application submitted successfully!", {
          icon: '🙌',
          style: { borderRadius: '12px', background: '#333', color: '#fff' }
      })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (e: any) {
      console.error("Failed to sync with backend", e)
      toast.error(e.message || "Submission failed. Please try again.")
    }
  }

  return (
    <>
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-12 md:py-16 font-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Volunteer With Us</h1>
          <p className="text-lg text-white/90">
            Join our team of dedicated volunteers making a difference every day.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background dark:bg-slate-950 transition-colors">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 font-primary">
          <div className="bg-muted dark:bg-slate-900 rounded-lg p-8 md:p-10 transition-colors">
            <h2 className="text-2xl font-bold text-foreground dark:text-gray-100 mb-6 transition-colors">Sign Up to Volunteer</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                Thank you for your interest! We'll contact you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-gray-200 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-gray-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-gray-200 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-gray-200 mb-3">Areas of Interest</label>
                <div className="space-y-2">
                  {["Education", "Healthcare", "Social Welfare", "Widows Outreach", "Orphanage Outreach"].map(
                    (interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleCheckbox(interest)}
                          className="w-4 h-4 rounded border-border dark:border-slate-800 bg-white dark:bg-slate-800"
                        />
                        <span className="ml-2 text-foreground dark:text-gray-300">{interest}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-gray-200 mb-2">Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
                >
                  <option value="">Select availability</option>
                  <option value="full-time" className="dark:bg-slate-800">Full-time</option>
                  <option value="part-time" className="dark:bg-slate-800">Part-time</option>
                  <option value="weekends" className="dark:bg-slate-800">Weekends Only</option>
                  <option value="flexible" className="dark:bg-slate-800">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-gray-200 mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
                  placeholder="Tell us more about yourself and why you want to volunteer..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Submit Volunteer Application
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
