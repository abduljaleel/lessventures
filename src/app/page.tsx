"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const stages = [
  { name: "Idea", width: "20%", desc: "Capture and pressure-test the thesis" },
  { name: "Validation", width: "40%", desc: "Customer evidence before capital" },
  { name: "Build", width: "60%", desc: "Narrow MVP, instrumented from day one" },
  { name: "Scale", width: "80%", desc: "Product-market fit earns investment" },
  { name: "Sunset", width: "100%", desc: "Kill without ego, learn without waste" },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroScrolled, setHeroScrolled] = useState(false);
  const numberSection = useInView(0.2);
  const systemSection = useInView(0.1);
  const metricsSection = useInView(0.2);
  const ctaSection = useInView(0.2);

  useEffect(() => {
    const handleScroll = () => {
      setHeroScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#c5a572]/20 selection:text-white">
      {/* ═══════════════════════════════════════════════════════════
          HERO — Full viewport. "Less." then "is more." on scroll.
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6"
      >
        {/* Subtle grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative flex flex-col items-center">
          {/* "Less." */}
          <h1
            className="text-[6rem] sm:text-[8rem] lg:text-[10rem] font-thin tracking-[-0.04em] leading-none transition-all duration-1000"
            style={{ opacity: 1 }}
          >
            Less.
          </h1>

          {/* "is more." fades in on scroll */}
          <p
            className="mt-2 text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-thin tracking-[-0.02em] text-white/60 transition-all duration-1000 ease-out"
            style={{
              opacity: heroScrolled ? 1 : 0,
              transform: heroScrolled ? "translateY(0)" : "translateY(20px)",
            }}
          >
            is more.
          </p>

          {/* Gold divider */}
          <div
            className="mt-12 transition-all duration-1000 ease-out"
            style={{
              width: heroScrolled ? "80px" : "0px",
              height: "1px",
              background: "#c5a572",
            }}
          />

          {/* Tagline */}
          <p
            className="mt-10 text-base sm:text-lg font-light tracking-[0.15em] uppercase text-white/30 transition-all duration-1000 delay-200 ease-out"
            style={{
              opacity: heroScrolled ? 1 : 0,
              transform: heroScrolled ? "translateY(0)" : "translateY(12px)",
            }}
          >
            The venture studio operating system.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12 flex flex-col items-center gap-3 transition-opacity duration-700"
          style={{ opacity: heroScrolled ? 0 : 0.3 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THE NUMBER — "12" with "ventures. one system."
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-40 px-6" ref={numberSection.ref}>
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-8 sm:gap-16">
          <span
            className="text-[10rem] sm:text-[14rem] lg:text-[18rem] font-thin leading-none tracking-[-0.06em] transition-all duration-1000 ease-out"
            style={{
              color: "#c5a572",
              opacity: numberSection.visible ? 1 : 0,
              transform: numberSection.visible ? "translateX(0)" : "translateX(-40px)",
            }}
          >
            12
          </span>
          <div
            className="flex flex-col transition-all duration-1000 delay-300 ease-out"
            style={{
              opacity: numberSection.visible ? 1 : 0,
              transform: numberSection.visible ? "translateX(0)" : "translateX(40px)",
            }}
          >
            <span className="text-2xl sm:text-4xl lg:text-5xl font-thin tracking-[-0.02em] text-white/80">
              ventures.
            </span>
            <span className="mt-1 text-2xl sm:text-4xl lg:text-5xl font-thin tracking-[-0.02em] text-white/40">
              one system.
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THE SYSTEM — Vertical stage ladder
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6" ref={systemSection.ref}>
        <div className="mx-auto max-w-3xl">
          {/* Section label */}
          <div className="mb-20 text-center">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#c5a572]">
              The System
            </span>
          </div>

          <div className="flex flex-col gap-10">
            {stages.map((stage, i) => (
              <div
                key={stage.name}
                className="group transition-all duration-700 ease-out"
                style={{
                  opacity: systemSection.visible ? 1 : 0,
                  transform: systemSection.visible
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                {/* Stage label row */}
                <div className="mb-3 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-white/20 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg sm:text-xl font-light tracking-wide text-white/80">
                      {stage.name}
                    </span>
                  </div>
                  <span className="text-xs text-white/20 font-light hidden sm:block">
                    {stage.desc}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative h-[2px] w-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                    style={{
                      width: systemSection.visible ? stage.width : "0%",
                      transitionDelay: `${i * 150 + 300}ms`,
                      background:
                        "linear-gradient(90deg, #c5a572 0%, rgba(197,165,114,0.3) 100%)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          METRICS STRIP — Three massive numbers
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-y border-white/[0.06] py-24 px-6" ref={metricsSection.ref}>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 sm:grid-cols-3 text-center">
          {[
            { value: "$615K", label: "governed" },
            { value: "63", label: "gates reviewed" },
            { value: "0", label: "ventures killed without evidence" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="transition-all duration-700 ease-out"
              style={{
                opacity: metricsSection.visible ? 1 : 0,
                transform: metricsSection.visible
                  ? "translateY(0)"
                  : "translateY(20px)",
                transitionDelay: `${i * 200}ms`,
              }}
            >
              <div className="text-5xl sm:text-6xl lg:text-7xl font-thin tracking-[-0.04em] text-white">
                {stat.value}
              </div>
              <div className="mt-3 text-[11px] tracking-[0.2em] uppercase text-white/25 font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — Single thin-bordered button
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-40 px-6" ref={ctaSection.ref}>
        <div
          className="mx-auto flex max-w-5xl flex-col items-center text-center transition-all duration-700 ease-out"
          style={{
            opacity: ctaSection.visible ? 1 : 0,
            transform: ctaSection.visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <Link href="/signup">
            <span className="inline-block border border-white/20 px-12 py-4 text-sm tracking-[0.2em] uppercase text-white/70 transition-all duration-300 hover:border-[#c5a572] hover:text-white cursor-pointer">
              Enter the studio &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER — Minimal
      ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-[11px] tracking-[0.2em] uppercase text-white/15 font-light">
          <span>&copy; Less Ventures</span>
          <span>12 Cities</span>
        </div>
      </footer>
    </div>
  );
}
