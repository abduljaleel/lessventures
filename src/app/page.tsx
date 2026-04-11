import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, BarChart3, Shield, BookOpen } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">L</div>
            <span className="font-semibold text-lg">Less Ventures</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login"><Button variant="ghost">Sign in</Button></Link>
            <Link href="/signup"><Button>Get started</Button></Link>
          </div>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">Less is more.</h1>
        <p className="mt-6 max-w-2xl text-xl text-muted-foreground">
          The venture studio operating system for disciplined builders.
          Track ventures. Enforce stage gates. Allocate capital with rigor.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/signup"><Button size="lg">Start building<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          <Link href="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
        </div>
      </section>

      <section className="border-t bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-bold">Discipline creates freedom</h2>
          <p className="text-center mt-4 text-muted-foreground max-w-2xl mx-auto">
            Most venture studios drown in noise. Less Ventures enforces the structure that lets you focus on what matters.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Target className="h-8 w-8" />, title: "Stage-Gated Validation", desc: "Every venture passes through structured checkpoints. No hand-waving allowed." },
              { icon: <BarChart3 className="h-8 w-8" />, title: "Portfolio Intelligence", desc: "See capital allocation, burn rates, and stage distribution across your entire portfolio." },
              { icon: <Shield className="h-8 w-8" />, title: "Capital Discipline", desc: "Track budgets, enforce allocation rules, and make proceed/pivot/kill decisions with evidence." },
              { icon: <BookOpen className="h-8 w-8" />, title: "Venture Playbooks", desc: "Reusable templates for customer discovery, technical validation, and commercial viability." },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border bg-background p-6">
                <div className="text-primary">{f.icon}</div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h2 className="text-3xl font-bold">Stop managing ventures in spreadsheets.</h2>
        <p className="mt-4 text-lg text-muted-foreground">Less Ventures gives you the operating system your studio deserves.</p>
        <Link href="/signup" className="mt-8 inline-block"><Button size="lg">Create free account<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Less Ventures. All rights reserved.</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
