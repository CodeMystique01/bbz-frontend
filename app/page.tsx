import Link from "next/link";
import {
  ArrowRight, Shield, Zap, CreditCard, Star, Package, Users, TrendingUp,
  Search, Code, Palette, FileText, Music, Video, BookOpen, Layers, Type, Sparkles,
  CheckCircle, ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* ── Shared container style ─────────────────────────────── */
const container: React.CSSProperties = {
  maxWidth: 1100,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 24,
  paddingRight: 24,
};

/* ── Data ────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: "Software", icon: Code, bg: "#eff6ff", fg: "#2563eb", border: "#dbeafe" },
  { name: "Templates", icon: Layers, bg: "#faf5ff", fg: "#9333ea", border: "#f3e8ff" },
  { name: "Graphics", icon: Palette, bg: "#fdf2f8", fg: "#db2777", border: "#fce7f3" },
  { name: "Audio", icon: Music, bg: "#fffbeb", fg: "#d97706", border: "#fef3c7" },
  { name: "Video", icon: Video, bg: "#fef2f2", fg: "#dc2626", border: "#fee2e2" },
  { name: "E-books", icon: BookOpen, bg: "#ecfdf5", fg: "#059669", border: "#d1fae5" },
  { name: "Courses", icon: FileText, bg: "#ecfeff", fg: "#0891b2", border: "#cffafe" },
  { name: "Fonts", icon: Type, bg: "#fff7ed", fg: "#ea580c", border: "#ffedd5" },
];

const FEATURED = [
  { id: 1, name: "SaaS Landing Page Kit", price: 1999, was: 4999, cat: "Templates", rating: 4.8, reviews: 124, emoji: "🎨" },
  { id: 2, name: "Invoice & Billing Automation", price: 2499, was: 7999, cat: "Software", rating: 4.9, reviews: 89, emoji: "📊" },
  { id: 3, name: "Social Media Graphics Pack", price: 999, was: 2999, cat: "Graphics", rating: 4.7, reviews: 213, emoji: "✨" },
  { id: 4, name: "Complete React UI Library", price: 3499, was: 9999, cat: "Software", rating: 4.9, reviews: 156, emoji: "⚛️" },
  { id: 5, name: "Background Music Bundle", price: 1499, was: 4499, cat: "Audio", rating: 4.6, reviews: 78, emoji: "🎵" },
  { id: 6, name: "SEO Mastery Course", price: 1999, was: 5999, cat: "Courses", rating: 4.8, reviews: 342, emoji: "📈" },
];

const REVIEWS = [
  { name: "Priya S.", role: "Freelance Designer", text: "Found amazing design assets at prices I couldn't believe. The quality rivals premium marketplaces." },
  { name: "Rahul K.", role: "Indie Developer", text: "Sold my first SaaS template here. The vendor dashboard is incredibly smooth. Payouts are fast!" },
  { name: "Anita M.", role: "Content Creator", text: "The music and video packs saved me hours of production time. Will keep coming back." },
];

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Navbar />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #111827 0%, #111827 60%, #1e3a5f 100%)",
          paddingTop: 80,
          paddingBottom: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ ...container, textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#93c5fd",
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 32,
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            India&apos;s Fastest Growing Digital Marketplace
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Incredible Deals on{" "}
            <span style={{ color: "#38bdf8" }}>Digital Products</span>
          </h1>

          <p
            style={{
              marginTop: 20,
              fontSize: 17,
              color: "#9ca3af",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.7,
            }}
          >
            Discover software, templates, courses, and creative assets from
            verified vendors — at prices that will surprise you.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: 480, margin: "36px auto 0" }}>
            <Link
              href="/products"
              style={{
                display: "flex",
                alignItems: "center",
                background: "#ffffff",
                borderRadius: 12,
                padding: "14px 20px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                textDecoration: "none",
              }}
            >
              <Search style={{ width: 18, height: 18, color: "#9ca3af", marginRight: 12, flexShrink: 0 }} />
              <span style={{ color: "#9ca3af", fontSize: 14, flex: 1, textAlign: "left" }}>
                Search 1,000+ digital products...
              </span>
              <span
                style={{
                  marginLeft: 12,
                  padding: "6px 14px",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                Search
              </span>
            </Link>
          </div>

          {/* Trust */}
          <div
            style={{
              marginTop: 36,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 28,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            {[
              { icon: Shield, color: "#4ade80", label: "Secure Payments" },
              { icon: Star, color: "#fbbf24", label: "Verified Vendors" },
              { icon: CreditCard, color: "#60a5fa", label: "Razorpay Powered" },
              { icon: Zap, color: "#facc15", label: "Instant Delivery" },
            ].map((b) => (
              <span key={b.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <b.icon style={{ width: 14, height: 14, color: b.color }} />
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section style={{ borderBottom: "1px solid #f3f4f6", padding: "24px 0" }}>
        <div style={{ ...container }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Digital Products", value: "1,000+", icon: Package },
              { label: "Active Vendors", value: "200+", icon: Users },
              { label: "Happy Buyers", value: "5,000+", icon: Star },
              { label: "Total Transactions", value: "₹10L+", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2563eb",
                    flexShrink: 0,
                  }}
                >
                  <s.icon style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CATEGORIES ═══════════════════ */}
      <section style={{ padding: "64px 0" }}>
        <div style={{ ...container }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>Browse by Category</h2>
              <p style={{ marginTop: 6, fontSize: 14, color: "#9ca3af" }}>Find exactly what you need</p>
            </div>
            <Link href="/products" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
              View All <ChevronRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                href={`/products?category=${c.name}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.fg,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "transform .15s",
                }}
              >
                <c.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ DEALS ═══════════════════ */}
      <section style={{ padding: "64px 0", background: "#f9fafb" }}>
        <div style={{ ...container }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "#fef2f2",
                  color: "#dc2626",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                🔥 Hot Deals
              </span>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>Today&apos;s Best Deals</h2>
              <p style={{ marginTop: 6, fontSize: 14, color: "#9ca3af" }}>Handpicked products at incredible prices</p>
            </div>
            <Link href="/products" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
              See All Deals <ChevronRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {FEATURED.map((p) => {
              const off = Math.round(((p.was - p.price) / p.was) * 100);
              return (
                <Link
                  key={p.id}
                  href="/products"
                  style={{
                    display: "block",
                    background: "#ffffff",
                    borderRadius: 14,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    textDecoration: "none",
                    transition: "box-shadow .2s, transform .2s",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      height: 160,
                      background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <span style={{ fontSize: 48 }}>{p.emoji}</span>
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "#dc2626",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {off}% OFF
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.9)",
                        color: "#6b7280",
                        fontSize: 10,
                        fontWeight: 500,
                      }}
                    >
                      {p.cat}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ padding: 20 }}>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 1 }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            style={{
                              width: 12,
                              height: 12,
                              fill: i < Math.round(p.rating) ? "#fbbf24" : "none",
                              color: i < Math.round(p.rating) ? "#fbbf24" : "#e5e7eb",
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>{p.rating}</span>
                      <span style={{ fontSize: 12, color: "#d1d5db" }}>({p.reviews})</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{inr(p.price)}</span>
                      <span style={{ fontSize: 13, color: "#9ca3af", textDecoration: "line-through" }}>{inr(p.was)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section style={{ padding: "72px 0" }}>
        <div style={{ ...container, textAlign: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>How It Works</h2>
          <p style={{ marginTop: 8, fontSize: 14, color: "#9ca3af" }}>Get started in three simple steps</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, marginTop: 48 }}>
            {[
              { step: "01", title: "Create Your Account", desc: "Sign up in seconds as a buyer or vendor. Verify your email and you're ready to go.", icon: Users },
              { step: "02", title: "Browse & Discover", desc: "Search thousands of digital products by category, price, and rating.", icon: Search },
              { step: "03", title: "Purchase Securely", desc: "Pay securely via Razorpay. Get instant access with license key delivery.", icon: Shield },
            ].map((s) => (
              <div key={s.step}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <s.icon style={{ width: 24, height: 24, color: "#2563eb" }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Step {s.step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111827", margin: "8px 0 10px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section style={{ padding: "64px 0", background: "#f9fafb" }}>
        <div style={{ ...container }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>Loved by Creators & Buyers</h2>
            <p style={{ marginTop: 8, fontSize: 14, color: "#9ca3af" }}>See what our community has to say</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                style={{
                  background: "#ffffff",
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  padding: 24,
                }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} style={{ width: 14, height: 14, fill: "#fbbf24", color: "#fbbf24" }} />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, margin: "0 0 20px" }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#1d4ed8",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ VENDOR CTA ═══════════════════ */}
      <section style={{ padding: "80px 0", background: "#111827" }}>
        <div style={{ ...container }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            {/* Left */}
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: 20,
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "#60a5fa",
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 24,
                }}
              >
                For Creators & Vendors
              </span>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "#ffffff", lineHeight: 1.2, margin: "0 0 16px" }}>
                Start Selling Your Digital Products Today
              </h2>
              <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.7, margin: "0 0 28px" }}>
                Join 200+ vendors already earning on BuyBizz. List your products, track real-time analytics, and receive automated payouts.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                {[
                  "Zero listing fees — no upfront costs",
                  "Real-time analytics & sales tracking",
                  "Automated payouts via RazorpayX",
                  "Built-in messaging with buyers",
                  "License key management included",
                ].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#d1d5db", marginBottom: 12 }}>
                    <CheckCircle style={{ width: 16, height: 16, color: "#4ade80", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div style={{ display: "flex", gap: 12 }}>
                <Link
                  href="/signup?role=VENDOR"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    height: 48,
                    padding: "0 28px",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: 14,
                    fontWeight: 600,
                    borderRadius: 12,
                    textDecoration: "none",
                  }}
                >
                  Become a Vendor <ArrowRight style={{ width: 16, height: 16 }} />
                </Link>
                <Link
                  href="/products"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    height: 48,
                    padding: "0 28px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: 500,
                    borderRadius: 12,
                    textDecoration: "none",
                  }}
                >
                  Browse as Buyer
                </Link>
              </div>
            </div>

            {/* Right — Mock Dashboard */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 28,
              }}
            >
              {/* Revenue */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Revenue</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#ffffff", marginTop: 4 }}>₹2,45,800</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp style={{ width: 22, height: 22, color: "#4ade80" }} />
                  </div>
                </div>
              </div>

              {/* Mini stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "Products", val: "24" },
                  { label: "Orders", val: "156" },
                  { label: "Rating", val: "4.9 ⭐" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginTop: 4 }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 12 }}>Weekly Sales</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 64 }}>
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        background: "rgba(59,130,246,0.35)",
                        borderRadius: "4px 4px 0 0",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section style={{ padding: "72px 0" }}>
        <div style={{ ...container, textAlign: "center", maxWidth: 600 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>
            Ready to find your next great tool?
          </h2>
          <p style={{ fontSize: 14, color: "#9ca3af", margin: "0 0 28px", lineHeight: 1.7 }}>
            Join thousands of buyers and creators on India&apos;s most trusted digital product marketplace.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 48,
                padding: "0 28px",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              Create Free Account <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 48,
                padding: "0 28px",
                background: "#ffffff",
                color: "#374151",
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                textDecoration: "none",
              }}
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
