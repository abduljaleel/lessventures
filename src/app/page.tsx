"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ACCENT = "#f0a050";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const loopSteps = [
  {
    code: "01",
    actor: "USER",
    label: "complains",
    quote: "Can't filter tasks by tag.",
    detail: "Captured in-product or via support channel.",
  },
  {
    code: "02",
    actor: "MEND",
    label: "observes workflow",
    quote: "47 users repeat the same hunt for a tag.",
    detail: "Telemetry, session traces, drop-off points.",
  },
  {
    code: "03",
    actor: "MEND",
    label: "writes new endpoint + UI",
    quote: "GET /tasks?tag= and a TagFilter control.",
    detail: "Branch opened, tests added, diff prepared.",
  },
  {
    code: "04",
    actor: "MEND",
    label: "ships",
    quote: "Promoted to 100% after Axiom + Lodestar pass.",
    detail: "UI updates in real-time, no human in loop.",
  },
];

function MendMark({ size = 22 }: { size?: number }) {
  // A stitching/suture mark — "mend"
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
    >
      <path d="M3 20 C 10 8, 22 8, 29 20" opacity="0.4" />
      <path d="M3 20 L 8 17 M8 23 L 13 18 M13 22 L 18 17 M18 23 L 23 18 M23 22 L 29 20" />
    </svg>
  );
}

function ApiCard({
  title,
  variant,
  active,
}: {
  title: string;
  variant: "before" | "after";
  active?: boolean;
}) {
  return (
    <div
      className="rounded-md border bg-[#0d0d0d] overflow-hidden"
      style={{
        borderColor:
          variant === "after" ? `${ACCENT}55` : "rgba(255,255,255,0.08)",
        boxShadow:
          variant === "after" && active
            ? `0 12px 40px -10px ${ACCENT}40`
            : undefined,
      }}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-wider"
          style={{
            color:
              variant === "after" ? ACCENT : "rgba(255,255,255,0.35)",
          }}
        >
          {title}
        </span>
        <span className="h-2 w-8" />
      </div>

      <div className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3">
          Tasks
        </div>
        <div className="space-y-2">
          {[
            { name: "Update Q3 brief", tag: "urgent" },
            { name: "Review supplier list", tag: "ops" },
            { name: "Draft kickoff agenda", tag: "urgent" },
            { name: "Refresh dashboard data", tag: "ops" },
            { name: "Approve invoice batch", tag: "finance" },
          ].map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between border-b border-white/5 pb-2"
            >
              <span className="text-sm text-white/80">{t.name}</span>
              <span
                className="font-mono text-[10px] uppercase tracking-wider rounded-sm px-2 py-0.5"
                style={
                  variant === "after" && t.tag === "urgent"
                    ? { background: `${ACCENT}22`, color: ACCENT }
                    : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)" }
                }
              >
                {t.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Filter chip — only shows on "after" */}
        <div className="mt-5 flex items-center gap-2">
          {variant === "after" ? (
            <>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                filter
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-sm px-2 py-1 font-mono text-[10px]"
                style={{ borderColor: `${ACCENT}66`, color: ACCENT, border: "1px solid" }}
              >
                tag: urgent
                <span aria-hidden>&times;</span>
              </span>
              <span className="font-mono text-[10px] text-white/30">2 of 5</span>
            </>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
              no filter available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const visualSection = useInView(0.1);
  const loopSection = useInView(0.1);
  const guardsSection = useInView(0.2);
  const statsSection = useInView(0.2);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#f0a050]/30">
      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3" style={{ color: ACCENT }}>
            <MendMark size={22} />
            <div className="flex flex-col leading-tight">
              <span
                className="text-base"
                style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
              >
                Mend
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                mend.us &middot; San Francisco
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
              Optimization layer
            </span>
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm border rounded px-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ color: ACCENT, borderColor: `${ACCENT}55` }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
              From San Francisco &mdash; where software learns to listen.
            </p>
            <h1
              className="mt-8 text-[5rem] sm:text-[7rem] lg:text-[8.5rem] leading-[0.95] tracking-tight"
              style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
            >
              Mend
            </h1>
            <p
              className="mt-6 text-xl sm:text-2xl text-white/70 max-w-xl"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              A persistent agent that rewrites its own application logic.
            </p>
            <p className="mt-6 max-w-xl text-base text-white/45 leading-relaxed">
              <span
                className="font-mono text-xs uppercase tracking-wider"
                style={{ color: ACCENT }}
              >
                The problem &mdash;
              </span>{" "}
              a user complains. A human fixes it. Repeat forever. Mend closes
              the loop: it watches the complaint, builds the fix, and ships it
              behind your safety rails.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
                style={{ backgroundColor: ACCENT, color: "#0a0a0a" }}
              >
                Deploy Mend
                <span aria-hidden>&rarr;</span>
              </Link>
              <Link
                href="/login"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                or sign in
              </Link>
            </div>
          </div>

          {/* Right side: quick "complaint -> fix" tile */}
          <div className="lg:col-span-5">
            <div
              className="rounded-md border bg-[#0d0d0d] p-5"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 mb-3">
                Today, on production
              </div>
              <div className="text-base text-white/85 leading-relaxed">
                <span className="text-white/45">user_4218:</span>{" "}
                &ldquo;Can&rsquo;t filter by tag.&rdquo;
              </div>
              <div className="mt-3 font-mono text-[11px] text-white/40 space-y-1">
                <div>
                  <span style={{ color: ACCENT }}>[mend]</span> 47 similar
                  workflows observed in last 24h
                </div>
                <div>
                  <span style={{ color: ACCENT }}>[mend]</span> drafting
                  endpoint &amp; UI
                </div>
                <div>
                  <span style={{ color: ACCENT }}>[mend]</span> axiom check
                  &middot; passed
                </div>
                <div>
                  <span style={{ color: ACCENT }}>[mend]</span> lodestar
                  proof &middot; verified
                </div>
                <div className="pt-1" style={{ color: ACCENT }}>
                  [mend] shipping to canary &rarr; promoting to 100%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before / after the UI change */}
      <section
        ref={visualSection.ref}
        className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: ACCENT }}
            >
              The UI change Mend wrote
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl tracking-tight"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              From complaint to filter, without a ticket.
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-[10px] uppercase tracking-wider text-white/30">
            before &middot; after
          </span>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-700"
          style={{
            opacity: visualSection.visible ? 1 : 0,
            transform: visualSection.visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
              Before &middot; original UI
            </div>
            <ApiCard title="TASKS · v 1.42" variant="before" />
          </div>
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
              After &middot; Mend shipped a tag filter
            </div>
            <ApiCard title="TASKS · v 1.43" variant="after" active />
          </div>
        </div>

        {/* The code Mend wrote */}
        <div className="mt-8 rounded-md border bg-[#080808] overflow-hidden"
          style={{ borderColor: `${ACCENT}33` }}
        >
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              server/routes/tasks.ts &middot; written by mend
            </span>
            <span className="font-mono text-[10px]" style={{ color: ACCENT }}>
              +18 / &minus;0
            </span>
          </div>
          <pre className="px-4 py-4 overflow-x-auto font-mono text-[12px] leading-relaxed text-white/80">
{`router.get("/tasks", async (req, res) => {
  const { tag } = req.query;
  const where = tag ? { tags: { has: String(tag) } } : {};
  const tasks = await db.task.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
  return res.json(tasks);
});`}
          </pre>
        </div>
      </section>

      {/* The 4-stage loop */}
      <section
        ref={loopSection.ref}
        className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5"
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: ACCENT }}
        >
          The feedback loop
        </p>
        <h2
          className="mt-3 text-3xl sm:text-4xl tracking-tight max-w-2xl"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          A closed cycle from complaint to deploy &mdash; without a human in
          the middle.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5 rounded-lg overflow-hidden">
          {loopSteps.map((s, i) => (
            <div
              key={s.code}
              className="bg-[#0d0d0d] p-6 flex flex-col gap-3 transition-all duration-700"
              style={{
                opacity: loopSection.visible ? 1 : 0,
                transform: loopSection.visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider" style={{ color: ACCENT }}>
                  {s.code}
                </span>
                {i < loopSteps.length - 1 ? (
                  <span
                    className="hidden md:inline font-mono text-xs"
                    style={{ color: `${ACCENT}88` }}
                    aria-hidden
                  >
                    &rarr;
                  </span>
                ) : (
                  <span
                    className="hidden md:inline font-mono text-xs"
                    style={{ color: `${ACCENT}88` }}
                    aria-hidden
                  >
                    &#x21bb;
                  </span>
                )}
              </div>
              <p className="font-mono text-[11px] tracking-wider uppercase text-white/40">
                {s.actor}
              </p>
              <p className="text-lg text-white/90 leading-snug">{s.label}</p>
              <p className="text-sm text-white/55 italic">
                &ldquo;{s.quote}&rdquo;
              </p>
              <p className="text-xs text-white/35 leading-relaxed">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Guards */}
      <section
        ref={guardsSection.ref}
        className="border-t border-white/5"
      >
        <div
          className="mx-auto max-w-5xl px-6 py-20 text-center transition-all duration-700"
          style={{
            opacity: guardsSection.visible ? 1 : 0,
            transform: guardsSection.visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            Guardrails
          </p>
          <h2
            className="mt-4 text-2xl sm:text-3xl tracking-tight max-w-3xl mx-auto"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            All changes pass{" "}
            <span style={{ color: ACCENT }}>Axiom</span> (constraints) and{" "}
            <span style={{ color: ACCENT }}>Lodestar</span> (proofs) before
            deploying.
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 rounded-lg overflow-hidden text-left">
            <div className="bg-[#0d0d0d] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Axiom &middot; constraints
              </div>
              <p className="mt-2 text-white/80">
                Schema limits, auth boundaries, rate envelopes, allowed
                domains. Mend cannot deploy a change that violates them.
              </p>
            </div>
            <div className="bg-[#0d0d0d] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Lodestar &middot; proofs
              </div>
              <p className="mt-2 text-white/80">
                Behavioural parity, regression coverage, invariant checks.
                Every diff is proven before it reaches production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsSection.ref}
        className="border-t border-white/5"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 rounded-lg overflow-hidden transition-all duration-700"
            style={{
              opacity: statsSection.visible ? 1 : 0,
              transform: statsSection.visible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <div className="bg-[#0d0d0d] p-10 text-center">
              <div
                className="text-5xl sm:text-6xl tracking-tight"
                style={{ fontFamily: "ui-serif, Georgia, serif", color: ACCENT }}
              >
                1,847
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                user complaints fixed without human intervention
              </div>
            </div>
            <div className="bg-[#0d0d0d] p-10 text-center">
              <div
                className="text-5xl sm:text-6xl tracking-tight"
                style={{ fontFamily: "ui-serif, Georgia, serif", color: ACCENT }}
              >
                0
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                unauthorized changes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2
            className="text-3xl sm:text-4xl tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            Let your application close its own loop.
          </h2>
          <p className="mt-4 text-white/50">
            Mend listens, builds, proves, ships &mdash; while you sleep.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-medium transition-colors"
              style={{ backgroundColor: ACCENT, color: "#0a0a0a" }}
            >
              Connect a repo
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3" style={{ color: ACCENT }}>
            <MendMark size={18} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
              Mend &middot; San Francisco &middot; mend.us
            </span>
          </div>
          <a
            href="https://abduljaleel.xyz/aletheia/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-white/5"
            style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
          >
            Part of the Aletheia stack
            <span aria-hidden>&#8599;</span>
          </a>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
          Optimization layer &middot; from San Francisco, software that listens
        </div>
      </footer>
    </div>
  );
}
