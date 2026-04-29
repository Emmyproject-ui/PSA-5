'use client'

import { useState } from 'react'
import { usePaystackPayment } from 'react-paystack'
import toast from 'react-hot-toast'
import { Heart, ShieldCheck, Sparkles, Trophy, ArrowRight } from 'lucide-react'
import { customerApi } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'

export default function DonatePage() {
  const { user } = useAuth()
  const [amount, setAmount] = useState('5000')
  const [customAmount, setCustomAmount] = useState('')
  const [donationType, setDonationType] = useState('once')
  const email = user?.email || ''
  const fullName = user?.name || ''

  const presetAmounts = ['1000', '5000', '10000', '50000']

  // Paystack Configuration
  const finalAmount = customAmount || amount
  const config = {
    reference: (new Date()).getTime().toString(),
    email: email || "donor@example.com",
    amount: parseInt(finalAmount) * 100, // Paystack works in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder', // Add NEXT_PUBLIC_ to make it accessible to frontend
  }

  const initializePayment = usePaystackPayment(config)

  const onSuccess = async (reference: any) => {
    toast.success(`Thank you, ${fullName}! Your donation of ₦${finalAmount} was successful.`, {
      duration: 6000,
      icon: '❤️',
      style: {
        borderRadius: '16px',
        background: '#333',
        color: '#fff',
      },
    })
    
    // Notify Backend via Service Layer
    try {
      await customerApi.donate({
        amount: parseInt(finalAmount),
        payment_reference: reference.reference,
        payment_method: 'paystack',
      });
    } catch (e: any) {
      console.error("Failed to sync with backend", e)
      toast.error(e.message || "Failed to record your donation. Please contact support.")
    }
  }

  const onClose = () => {
    toast.error('Payment cancelled')
  }

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    initializePayment({ onSuccess, onClose })
  }

  return (
    <div className="bg-[#fafafa] dark:bg-slate-950 transition-colors">
      {/* Premium Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-slate-900">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070')] bg-cover bg-center opacity-30"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
           
           <div className="relative z-10 text-center px-4">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Join the Movement</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">Support Our <span className="text-primary italic">Legacy</span></h1>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">Your generosity fuels our mission to bring light to the darkest corners of humanity.</p>
           </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-32 relative z-20">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Form Section */}
            <div className="lg:col-span-7 font-primary">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12 transition-all hover:shadow-slate-300/50 dark:hover:shadow-none">
                <form onSubmit={handleDonate} className="space-y-10">
                  
                  {/* Toggle Mode */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full max-w-[280px] sm:max-w-xs mx-auto mb-12">
                    <button
                      type="button"
                      onClick={() => setDonationType('once')}
                      className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                        donationType === 'once' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-600' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Give Once
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationType('monthly')}
                      className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                        donationType === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-600' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>

                  {/* Amount Grid */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                        <Heart className="text-primary h-5 w-5" /> Select Amount (NGN)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setAmount(preset)
                            setCustomAmount('')
                          }}
                          className={`py-4 rounded-2xl font-black transition-all text-lg ${
                            amount === preset && !customAmount
                              ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10'
                              : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/30 dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors'
                          }`}
                        >
                          ₦{parseInt(preset).toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div className="relative group">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300 dark:text-slate-600 group-focus-within:text-primary transition-colors">₦</span>
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value)
                                setAmount('')
                            }}
                            placeholder="Enter custom amount"
                            className="w-full pl-12 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none font-bold text-lg text-gray-900 dark:text-gray-100 transition-all"
                        />
                    </div>
                  </div>

                  {/* Information */}
                  <div className="grid md:grid-cols-2 gap-6 pt-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Full Name</label>
                      <input
                        type="text"
                        required
                        readOnly
                        value={fullName}
                        className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800/60 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-semibold text-slate-600 dark:text-slate-300 cursor-not-allowed transition-all"
                        placeholder="Your name from your account"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Email Address</label>
                      <input
                        type="email"
                        required
                        readOnly
                        value={email}
                        className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800/60 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-semibold text-slate-600 dark:text-slate-300 cursor-not-allowed transition-all"
                        placeholder="Your email from your account"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-primary dark:hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-primary/30 active:scale-[0.98] group"
                  >
                    Confirm Donation ₦{parseInt(finalAmount || '0').toLocaleString()}
                    <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-6 pt-4 text-slate-400 dark:text-slate-500 font-medium">
                     <div className="flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">SSL Secured</span>
                     </div>
                     <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800"></span>
                     <div className="flex items-center gap-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest">Powered by</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">paystack</span>
                     </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Impact Sidebar */}
            <div className="lg:col-span-5 space-y-8 lg:pt-12">
                <div className="bg-slate-900 dark:bg-slate-900/50 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/20 border border-slate-700/30">
                    <h2 className="text-3xl font-black mb-6 tracking-tight">Your Direct <span className="text-primary italic">Impact</span></h2>
                    
                    <div className="space-y-6">
                        <ImpactFact 
                            icon={<Trophy className="text-amber-400" />} 
                            title="Legacy Tier" 
                            desc="Donations over ₦10,000 earn you a spot on our Digital Wall of Heroes." 
                        />
                        <ImpactFact 
                            icon={<Heart className="text-rose-400" />} 
                            title="Life Line" 
                            desc="₦5,000 provides three balanced meals a day for a child for one month." 
                        />
                        <ImpactFact 
                            icon={<Sparkles className="text-sky-400" />} 
                            title="The Catalyst" 
                            desc="₦50,000 funds a full vocational training program for two local artisans." 
                        />
                    </div>
                    
                    <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-white font-bold text-sm">Monthly Goal Status</span>
                            <span className="text-primary font-black text-lg">72%</span>
                        </div>
                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[72%] rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4 font-bold uppercase tracking-widest">₦1.8M Raised of ₦2.5M Target</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                    <h3 className="text-slate-800 dark:text-gray-100 font-bold mb-4 font-primary">Why GGNF?</h3>
                    <ul className="space-y-3">
                      {["Tax Deductible Receipts", "100% Transparency Guarantee", "Bi-Annual Impact Reports", "Instant Confirmation"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium text-sm font-primary">
                            <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-500 flex items-center justify-center">
                                <ShieldCheck size={12} />
                            </div>
                            {item}
                        </li>
                      ))}
                    </ul>
                </div>
            </div>

          </div>
      </section>
    </div>
  )
}

function ImpactFact({ icon, title, desc }: any) {
    return (
        <div className="flex gap-4 group">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white mb-1">{title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
            </div>
        </div>
    )
}
