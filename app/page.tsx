import Link from "next/link";
import {
  ArrowRight, Shield, Zap, CreditCard, Star, Package, Users, TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50/30" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary-600 blur-3xl" />
          <div className="absolute bottom-10 right-40 w-64 h-64 rounded-full bg-primary-400 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              India&apos;s trusted digital marketplace
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Buy &amp; Sell{" "}
              <span className="text-primary-600">Digital Products</span> with
              Confidence
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
              BuyBizz connects creators and buyers in a secure marketplace.
              Sell your digital assets, software, and templates — or discover
              amazing products from verified vendors.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/signup?role=VENDOR" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all">
                Start Selling
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-500" /><span>Secure payments</span></div>
              <div className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /><span>Verified vendors</span></div>
              <div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary-500" /><span>Razorpay powered</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ label: "Digital Products", value: "1,000+", icon: Package },
            { label: "Active Vendors", value: "200+", icon: Users },
            { label: "Happy Buyers", value: "5,000+", icon: Star },
            { label: "Transactions", value: "₹10L+", icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Getting started is easy. Whether you&apos;re buying or selling, we&apos;ve made the process simple and secure.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create an Account", description: "Sign up as a buyer or vendor in seconds. Verify your email and you're ready to go.", color: "bg-blue-50 text-blue-600" },
              { step: "02", title: "Browse or List Products", description: "Buyers can browse thousands of digital products. Vendors can list their assets for sale.", color: "bg-indigo-50 text-indigo-600" },
              { step: "03", title: "Secure Transactions", description: "Pay securely via Razorpay. Vendors receive payouts directly to their bank accounts.", color: "bg-violet-50 text-violet-600" },
            ].map((item) => (
              <div key={item.step} className="relative p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow group">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.color} font-bold text-lg mb-5`}>{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vendor CTA ────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Start Selling Today</h2>
              <p className="text-lg text-primary-200 mb-8 leading-relaxed">Join hundreds of vendors. List your digital products, track sales, manage orders, and receive payouts — all from one dashboard.</p>
              <ul className="space-y-4 mb-10">
                {["Easy product listing with admin approval", "Real-time analytics and sales tracking", "Automated payouts via RazorpayX", "Built-in messaging with buyers", "License key management"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-primary-100">
                    <div className="w-5 h-5 rounded-full bg-primary-500/30 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=VENDOR" className="inline-flex items-center gap-2 h-12 px-8 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
                Become a Vendor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <div><p className="text-white font-medium">Total Revenue</p><p className="text-2xl font-bold text-white mt-1">₹2,45,800</p></div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/10 rounded-xl"><p className="text-primary-200 text-sm">Products</p><p className="text-xl font-bold text-white mt-1">24</p></div>
                    <div className="p-4 bg-white/10 rounded-xl"><p className="text-primary-200 text-sm">Orders</p><p className="text-xl font-bold text-white mt-1">156</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">Join BuyBizz today and be part of India&apos;s growing digital marketplace. It&apos;s free to create an account.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all">
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
