import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, BarChart3, Shield, BookOpen, Gem } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-[#e8e4de]">
      {/* Nav */}
      <header className="border-b border-[#262220]">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Gem className="h-6 w-6 text-[#c5a572]" />
            <span className="text-lg tracking-[0.2em] uppercase font-light">Less Ventures</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login"><Button variant="ghost" className="text-[#8a8580] hover:text-[#e8e4de] hover:bg-transparent">Sign in</Button></Link>
            <Link href="/signup"><Button className="bg-[#c5a572] text-[#0a0a0a] hover:bg-[#d4b88a] rounded-none px-6">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
        <div className="mb-8 h-px w-16 bg-[#c5a572]" />
        <h1 className="max-w-4xl text-6xl font-extralight tracking-tight sm:text-7xl lg:text-8xl leading-[0.95]">
          Less is more.
        </h1>
        <p className="mt-8 max-w-2xl text-lg font-light text-[#8a8580] leading-relaxed">
          The venture studio operating system for disciplined builders.
          Track ventures. Enforce stage gates. Allocate capital with rigor.
        </p>
        <div className="mt-12 flex gap-6">
          <Link href="/signup">
            <Button size="lg" className="bg-[#c5a572] text-[#0a0a0a] hover:bg-[#d4b88a] rounded-none px-8 h-12 text-sm tracking-wider uppercase">
              Start building
              <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-[#262220] text-[#8a8580] hover:text-[#e8e4de] hover:border-[#c5a572] rounded-none px-8 h-12 text-sm tracking-wider uppercase bg-transparent">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-[#262220]">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-center">
          <p className="text-sm tracking-[0.15em] uppercase text-[#8a8580] font-light">
            Built for studios running 5&ndash;50 ventures
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-4">
            <div className="mx-auto mb-6 h-px w-12 bg-[#c5a572]" />
            <h2 className="text-3xl font-extralight tracking-tight sm:text-4xl">Discipline creates freedom</h2>
            <p className="mt-4 text-[#8a8580] font-light max-w-xl mx-auto">
              Most venture studios drown in noise. Less Ventures enforces the structure that lets you focus on what matters.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Target, title: "Stage Gates", desc: "Every venture passes through structured checkpoints. No hand-waving. Evidence-based proceed, pivot, or kill decisions." },
              { icon: BarChart3, title: "Portfolio Intelligence", desc: "See capital allocation, burn rates, and stage distribution across your entire portfolio at a glance." },
              { icon: Shield, title: "Capital Discipline", desc: "Track budgets, enforce allocation rules, and govern capital deployment with the rigor it demands." },
              { icon: BookOpen, title: "Venture Playbooks", desc: "Reusable templates for customer discovery, technical validation, and commercial viability testing." },
            ].map((f) => (
              <div key={f.title} className="border border-[#262220] bg-[#111111] p-8 group hover:border-[#c5a572]/30 transition-colors">
                <f.icon className="h-6 w-6 text-[#c5a572]" />
                <h3 className="mt-6 text-base font-medium tracking-wide">{f.title}</h3>
                <p className="mt-3 text-sm text-[#8a8580] font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#262220] bg-[#0e0e0e]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 text-center">
            {[
              { value: "12", label: "Ventures tracked" },
              { value: "63", label: "Stage gates reviewed" },
              { value: "$615K", label: "Capital governed" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-extralight text-[#c5a572] tracking-tight">{stat.value}</div>
                <div className="mt-2 text-sm text-[#8a8580] tracking-[0.1em] uppercase font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto mb-6 h-px w-12 bg-[#c5a572]" />
          <h2 className="text-3xl font-extralight tracking-tight sm:text-4xl">Stop managing ventures in spreadsheets.</h2>
          <p className="mt-4 text-lg text-[#8a8580] font-light">
            Less Ventures gives you the operating system your studio deserves.
          </p>
          <Link href="/signup" className="mt-10 inline-block">
            <Button size="lg" className="bg-[#c5a572] text-[#0a0a0a] hover:bg-[#d4b88a] rounded-none px-10 h-12 text-sm tracking-wider uppercase">
              Create free account
              <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#262220]">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 text-xs text-[#8a8580] tracking-[0.1em] uppercase font-light">
          <span>&copy; {new Date().getFullYear()} Less Ventures</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
