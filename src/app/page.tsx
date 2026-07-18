import Link from "next/link";

const ACCENT = "#f0a050";
const CARD = "#0d0d0d";

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

const heroLog = [
  { text: "47 similar workflows observed in last 24h", canary: false },
  { text: "drafting endpoint & UI", canary: false },
  { text: "axiom check · passed", canary: false },
  { text: "lodestar proof · verified", canary: false },
  { text: "shipping to canary → promoting to 100%", canary: true },
];

const diffLines = [
  'router.get("/tasks", (req, res) => {',
  "  const { tag } = req.query",
  "  const where = tag ? {tags:{has:tag}} : {}",
  "  res.json(db.task.findMany({ where }))",
  "})",
];

const annotations = [
  "guarded by Axiom · schema unchanged",
  "Lodestar · 6 invariants proven",
  "canary → 100% in 41 min",
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
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 20 C 10 8, 22 8, 29 20" opacity="0.4" />
      <path d="M3 20 L 8 17 M8 23 L 13 18 M13 22 L 18 17 M18 23 L 23 18 M23 22 L 29 20" />
    </svg>
  );
}

function ApiCard({
  variant,
  active,
}: {
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
          style={{ color: variant === "after" ? ACCENT : "rgba(255,255,255,0.55)" }}
        >
          {variant === "after" ? "TASKS · v 1.43" : "TASKS · v 1.42"}
        </span>
        <span className="h-2 w-8" />
      </div>

      <div className={`p-5 ${variant === "after" ? "demo-after" : ""}`}>
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-3">
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
              data-tag={t.tag}
              className="demo-row flex items-center justify-between border-b border-white/5 pb-2"
            >
              <span className="text-sm text-white/80">{t.name}</span>
              <span
                className="font-mono text-[10px] uppercase tracking-wider rounded-sm px-2 py-0.5"
                style={
                  variant === "after" && t.tag === "urgent"
                    ? { background: `${ACCENT}22`, color: ACCENT }
                    : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)" }
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
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
                filter
              </span>
              <span
                className="demo-chip inline-flex items-center gap-1 rounded-sm px-2 py-1 font-mono text-[10px]"
                style={{ borderColor: `${ACCENT}66`, color: ACCENT, border: "1px solid" }}
              >
                tag: urgent
                <span aria-hidden>&times;</span>
              </span>
              <span className="font-mono text-[10px] text-white/55">2 of 5</span>
            </>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">
              no filter available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#f0a050]/30">
      <style>{`
        .mcta {
          background-color: ${ACCENT};
          color: #0a0a0a;
        }
        .mcta:hover { background-color: #d98a3a; }
        .mcta:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #0a0a0a, 0 0 0 4px ${ACCENT};
        }
        .mlink:focus-visible {
          outline: 2px solid ${ACCENT};
          outline-offset: 3px;
          border-radius: 2px;
        }
        .demo-radio {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          overflow: hidden;
        }
        .demo-pane { display: none; }
        #demo-before:checked ~ .demo-grid .demo-pane-before { display: block; }
        #demo-after:checked ~ .demo-grid .demo-pane-after { display: block; }
        .demo-seg label {
          color: rgba(255,255,255,0.55);
          border-color: rgba(255,255,255,0.12);
        }
        #demo-before:checked ~ .demo-seg label[for="demo-before"],
        #demo-after:checked ~ .demo-seg label[for="demo-after"] {
          color: ${ACCENT};
          border-color: ${ACCENT}66;
          background: ${ACCENT}14;
        }
        @media (min-width: 768px) {
          .demo-seg { display: none; }
          .demo-pane { display: block !important; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .marrow { transition: transform 0.2s ease; }
          .mcta:hover .marrow { transform: translateX(3px); }
          .demo-row { transition: opacity 0.2s ease; }
          .demo-after:has(.demo-chip:hover) .demo-row[data-tag="ops"],
          .demo-after:has(.demo-chip:hover) .demo-row[data-tag="finance"] {
            opacity: 0.3;
          }
          .mreveal { opacity: 0; animation: mReveal 0.7s ease both; }
          .mfade { opacity: 0; animation: mFade 0.4s ease both; }
          .mcursor { animation: mBlink 1.05s step-end infinite; }
          .mdraw {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: mDraw 1.1s ease forwards 0.35s;
          }
          @keyframes mReveal {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: none; }
          }
          @keyframes mFade { to { opacity: 1; } }
          @keyframes mBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          @keyframes mDraw { to { stroke-dashoffset: 0; } }
        }
      `}</style>

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
              <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                mend.us &middot; San Francisco
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
              Optimization layer
            </span>
            <Link
              href="/login"
              className="mlink hidden sm:inline text-sm text-white/60 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="mlink inline-flex min-h-[44px] items-center whitespace-nowrap rounded border px-4 text-sm transition-colors hover:bg-white/5"
              style={{ color: ACCENT, borderColor: `${ACCENT}55` }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">
              From San Francisco &mdash; where software learns to listen.
            </p>
            <h1
              className="mt-8 text-[5rem] sm:text-[7rem] lg:text-[8.5rem] leading-[0.95] tracking-tight"
              style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
            >
              Mend
            </h1>
            <p
              className="mt-6 text-xl sm:text-2xl text-white/75 max-w-xl"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              A persistent agent that rewrites its own application logic.
            </p>
            <p className="mt-6 max-w-xl text-base text-white/65 leading-relaxed">
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
            <div className="mt-10 flex items-center gap-5">
              <Link
                href="/signup"
                className="mcta inline-flex min-h-[44px] items-center gap-2 px-6 rounded text-sm font-medium"
              >
                Deploy Mend
                <span className="marrow" aria-hidden>&rarr;</span>
              </Link>
              <Link
                href="/login"
                className="mlink inline-flex min-h-[44px] items-center text-sm text-white/60 hover:text-white transition-colors"
              >
                or sign in
              </Link>
            </div>
          </div>

          {/* Right side: live replay terminal */}
          <div className="lg:col-span-5">
            <div
              className="rounded-md border bg-[#0d0d0d] p-5"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-3">
                Today, on production
              </div>
              <div className="mfade text-base text-white/85 leading-relaxed">
                <span className="text-white/60">user_4218:</span>{" "}
                &ldquo;Can&rsquo;t filter by tag.&rdquo;
              </div>
              <div className="mt-3 font-mono text-[11px] text-white/65 space-y-1.5">
                {heroLog.map((line, i) => (
                  <div
                    key={line.text}
                    className={`mfade ${line.canary ? "pt-1" : ""}`}
                    style={{
                      animationDelay: `${0.15 + i * 0.16}s`,
                      color: line.canary ? ACCENT : undefined,
                    }}
                  >
                    <span style={{ color: ACCENT }}>[mend]</span> {line.text}
                    {line.canary && (
                      <span
                        className="mcursor ml-1 inline-block h-[0.95em] w-[0.5em] translate-y-[1px] align-middle"
                        style={{ background: ACCENT }}
                        aria-hidden
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-white/5 pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                live replay &middot; resolved in 4m 12s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before / after the UI change */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <div className="mb-10">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            The UI change Mend wrote
          </p>
          <h2
            className="mt-3 text-5xl sm:text-6xl leading-[1.05] tracking-tight max-w-3xl"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            From complaint to filter, without a ticket.
          </h2>
        </div>

        <div className="demo mreveal">
          <input type="radio" id="demo-before" name="demo" className="demo-radio" />
          <input
            type="radio"
            id="demo-after"
            name="demo"
            className="demo-radio"
            defaultChecked
          />
          {/* Mobile-only segmented control */}
          <div className="demo-seg mb-4 flex gap-2" role="group" aria-label="Toggle before or after view">
            <label
              htmlFor="demo-before"
              className="flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-sm border px-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              Before &middot; v1.42
            </label>
            <label
              htmlFor="demo-after"
              className="flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-sm border px-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              After &middot; v1.43
            </label>
          </div>

          <div className="demo-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="demo-pane demo-pane-before">
              <div className="mb-3 hidden md:block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                Before &middot; original UI
              </div>
              <ApiCard variant="before" />
            </div>
            <div className="demo-pane demo-pane-after">
              <div
                className="mb-3 hidden md:block font-mono text-[10px] uppercase tracking-[0.25em]"
                style={{ color: ACCENT }}
              >
                After &middot; Mend shipped a tag filter
              </div>
              <ApiCard variant="after" active />
            </div>
          </div>
        </div>

        {/* The code Mend wrote — two-column editorial spread */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] mreveal">
          <div
            className="rounded-md border bg-[#080808] overflow-hidden"
            style={{ borderColor: `${ACCENT}33` }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                server/routes/tasks.ts
              </span>
              <span className="font-mono text-[10px]" style={{ color: ACCENT }}>
                +18 / &minus;0
              </span>
            </div>
            <div className="overflow-x-auto px-4 py-4 font-mono text-[10px] sm:text-[11px] leading-relaxed">
              {diffLines.map((line, i) => (
                <div key={i} className="flex">
                  <span
                    className="w-4 shrink-0 select-none text-right"
                    style={{ color: `${ACCENT}66` }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="w-3 shrink-0 select-none text-center"
                    style={{ color: ACCENT }}
                  >
                    +
                  </span>
                  <code className="whitespace-pre text-white/80">{line}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{ color: ACCENT }}
            >
              Why it&rsquo;s safe to ship
            </p>
            {annotations.map((a) => (
              <div key={a} className="flex items-start gap-3">
                <span
                  className="mt-2 h-px w-6 shrink-0"
                  style={{ background: `${ACCENT}66` }}
                />
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/65">
                  {a}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 4-stage loop */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: ACCENT }}
        >
          The feedback loop
        </p>
        <h2
          className="mt-3 text-5xl sm:text-6xl leading-[1.05] tracking-tight max-w-3xl"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          A closed cycle from complaint to deploy &mdash; without a human in
          the middle.
        </h2>

        {/* Desktop stepper rail */}
        <div className="mt-14 hidden md:block mreveal" aria-hidden>
          <div className="flex items-center">
            {loopSteps.map((s, i) => (
              <div key={s.code} className="flex items-center" style={i < loopSteps.length - 1 ? { flex: "1 1 0%" } : undefined}>
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]"
                  style={{ borderColor: `${ACCENT}66`, color: ACCENT, background: CARD }}
                >
                  {s.code}
                </span>
                {i < loopSteps.length - 1 && (
                  <span className="flex flex-1 items-center gap-2 px-3">
                    <span className="h-px flex-1" style={{ background: `${ACCENT}55` }} />
                    <span className="font-mono text-xs" style={{ color: ACCENT }}>
                      &rarr;
                    </span>
                    <span className="h-px flex-1" style={{ background: `${ACCENT}55` }} />
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* Return arc from 04 back to 01 */}
          <div className="relative mt-1 h-9">
            <svg
              className="w-full h-9"
              viewBox="0 0 1000 36"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M994 3 C994 40, 6 40, 6 5"
                pathLength={1}
                className="mdraw"
                style={{ stroke: `${ACCENT}66`, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const }}
              />
            </svg>
            <span
              className="absolute left-1/2 top-3 -translate-x-1/2 bg-[#0a0a0a] px-2 font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: ACCENT }}
            >
              &#x21bb; loops back to 01
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {loopSteps.map((s, i) => (
            <div
              key={s.code}
              className="relative flex gap-4 md:block mreveal"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Mobile-only vertical rail */}
              <div className="flex flex-col items-center md:hidden" aria-hidden>
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]"
                  style={{ borderColor: `${ACCENT}66`, color: ACCENT, background: CARD }}
                >
                  {s.code}
                </span>
                {i < loopSteps.length - 1 ? (
                  <span className="my-1 w-px flex-1" style={{ background: `${ACCENT}55` }} />
                ) : (
                  <span className="mt-2 font-mono text-sm" style={{ color: ACCENT }}>
                    &#x21bb;
                  </span>
                )}
              </div>

              <div className="flex-1 rounded-md border border-white/5 bg-[#0d0d0d] p-6 flex flex-col gap-3">
                <p className="font-mono text-[11px] tracking-wider uppercase text-white/55">
                  {s.actor}
                </p>
                <p className="text-lg text-white/90 leading-snug">{s.label}</p>
                <p className="text-sm text-white/65 italic">
                  &ldquo;{s.quote}&rdquo;
                </p>
                <p className="text-xs text-white/55 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guards */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center mreveal">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            Guardrails
          </p>
          <h2
            className="mt-4 text-4xl sm:text-5xl leading-[1.08] tracking-tight max-w-3xl mx-auto"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            All changes pass{" "}
            <span style={{ color: ACCENT }}>Axiom</span> (constraints) and{" "}
            <span style={{ color: ACCENT }}>Lodestar</span> (proofs) before
            deploying.
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 rounded-lg overflow-hidden text-left">
            <div className="bg-[#0d0d0d] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                Axiom &middot; constraints
              </div>
              <p className="mt-2 text-white/80">
                Schema limits, auth boundaries, rate envelopes, allowed
                domains. Mend cannot deploy a change that violates them.
              </p>
            </div>
            <div className="bg-[#0d0d0d] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
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
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 rounded-lg overflow-hidden mreveal">
            <div className="bg-[#0d0d0d] p-10">
              <div
                className="text-5xl sm:text-6xl tracking-tight"
                style={{ fontFamily: "ui-serif, Georgia, serif", color: ACCENT }}
              >
                1,847
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                user complaints fixed without human intervention
              </div>
            </div>
            <div className="bg-[#0d0d0d] p-10">
              <div
                className="flex items-center gap-3 text-5xl sm:text-6xl tracking-tight"
                style={{ fontFamily: "ui-serif, Georgia, serif", color: ACCENT }}
              >
                0
                <svg
                  viewBox="0 0 32 32"
                  width={30}
                  height={30}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12 L9 10 M9 18 L13 16 M13 14 L27 6" opacity="0.55" />
                  <path d="M11 17 L15 22 L27 8" />
                </svg>
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                unauthorized changes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center overflow-hidden">
          {/* Oversized suture flourish behind the headline */}
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-none"
            viewBox="0 0 32 20"
            fill="none"
            stroke={ACCENT}
            strokeWidth={0.4}
            strokeLinecap="round"
            aria-hidden="true"
            style={{ opacity: 0.05 }}
          >
            <path d="M2 14 C 10 4, 22 4, 30 14" />
            <path d="M2 14 L 6 11 M6 17 L 11 12 M11 16 L 16 11 M16 17 L 21 12 M21 16 L 26 12 M26 15 L 30 14" />
          </svg>
          <div className="relative">
            <h2
              className="text-5xl sm:text-6xl leading-[1.05] tracking-tight"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              Let your application close its own loop.
            </h2>
            <p className="mt-5 text-white/65">
              Mend listens, builds, proves, ships &mdash; while you sleep.
            </p>
            <div className="mt-10">
              <Link
                href="/signup"
                className="mcta inline-flex min-h-[44px] items-center gap-2 px-8 py-4 rounded text-base font-medium"
              >
                Connect a repo
                <span className="marrow" aria-hidden>&rarr;</span>
              </Link>
            </div>
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
            className="mlink inline-flex min-h-[44px] items-center gap-2 rounded border px-4 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-white/5"
            style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
          >
            Part of the Aletheia stack
            <span aria-hidden>&#8599;</span>
          </a>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
          Optimization layer &middot; from San Francisco, software that listens
        </div>
      </footer>
    </div>
  );
}
