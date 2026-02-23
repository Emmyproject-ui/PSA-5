"use client"

import { useState } from "react"
import api from "@/lib/axios"
import Footer from '@/components/footer'
import Link from "next/link"
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, Linkedin, Heart, Users, Loader2 } from "lucide-react"

const SUBJECT_OPTIONS = [
  { value: "", label: "Select a subject" },
  { value: "general", label: "General Inquiry" },
  { value: "donation", label: "Donation Question" },
  { value: "partnership", label: "Partnership" },
  { value: "volunteer", label: "Volunteer" },
  { value: "media", label: "Media / Press" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)

    try {
      // Axios usage
      const response = await api.post('/contact', {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.status === 200 || response.status === 201) {
        setStatus({ type: "success", message: "Thank you! Your message has been sent successfully. We'll get back to you soon." })
        setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" })
      } else {
         setStatus({ type: "error", message: "Something went wrong. Please try again." })
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Unable to send message. Please check your connection and try again.";
      setStatus({ type: "error", message: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <main className="min-h-screen pt-24 pb-16 bg-background dark:bg-slate-950 transition-colors">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Contact Us</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl leading-relaxed">
              Have questions about our work? Want to partner with us, make a donation, or volunteer? 
              We'd love to hear from you. Reach out and let's create positive change together.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10 border border-slate-100 dark:border-slate-800 font-primary transition-colors">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-gray-100 mb-2">Send Us a Message</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 transition-colors">Fill out the form below and we'll respond within 24-48 hours.</p>

                {status && (
                  <div
                    className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                      status.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-bold text-slate-700 dark:text-gray-200 mb-2 transition-colors">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-gray-100"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-gray-200 mb-2 transition-colors">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-gray-100"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 dark:text-gray-200 mb-2 transition-colors">
                      Phone Number <span className="text-slate-400 dark:text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-gray-100"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-slate-700 dark:text-gray-200 mb-2 transition-colors">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-gray-100"
                    >
                      {SUBJECT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="dark:bg-slate-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-slate-700 dark:text-gray-200 mb-2 transition-colors">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-gray-100 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-4 px-6 rounded-xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info & CTA */}
              <div className="space-y-8">
                {/* Direct Contact */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10 border border-slate-100 dark:border-slate-800 transition-colors font-primary">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-gray-100 mb-6 tracking-tight transition-colors transition-colors">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-gray-100 transition-colors">Email</h3>
                        <a href="mailto:info@ggnf.org" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                          info@ggnf.org
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-gray-100 transition-colors">Phone / WhatsApp</h3>
                        <a href="tel:+2348012345678" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                          +234 801 234 5678
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-gray-100 transition-colors">Location</h3>
                        <p className="text-slate-600 dark:text-slate-400 transition-colors transition-colors">Serving communities across Nigeria</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <h3 className="font-bold text-slate-900 dark:text-gray-100 transition-colors mb-4">Follow Us</h3>
                    <div className="flex gap-3">
                      <a
                        href="https://facebook.com/ggnf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a
                        href="https://instagram.com/ggnf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href="https://twitter.com/ggnf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a
                        href="https://linkedin.com/company/ggnf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Call to Action Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    href="/donate"
                    className="group bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                  >
                    <Heart className="h-8 w-8 mb-4" fill="currentColor" />
                    <h3 className="text-xl font-black mb-2">Make a Donation</h3>
                    <p className="text-white/80 text-sm">Support our mission to create lasting change in communities.</p>
                  </Link>

                  <Link
                    href="/volunteer"
                    className="group bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-xl shadow-slate-800/20"
                  >
                    <Users className="h-8 w-8 mb-4" />
                    <h3 className="text-xl font-black mb-2">Volunteer With Us</h3>
                    <p className="text-white/80 text-sm">Join our team and make a direct impact in people's lives.</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
