"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { site } from "@/data/site";

export default function Footer() {
  const root = useRef(null);
  const mark = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mark.current,
        { yPercent: 45, scale: 0.86 },
        {
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 1 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      ref={root}
      data-phase="MINIMUM"
      className="relative z-10 overflow-hidden px-[var(--gutter)] pt-28 md:pt-40"
    >
      <div className="grid gap-12 border-t border-hairline pt-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="max-w-sm text-[15px] leading-relaxed text-muted">
            A product studio for web platforms, trading systems, mobile apps and growth. We keep the light on after launch.
          </p>
          <a href={`mailto:${site.email}`} className="link-line mt-6 inline-block text-xl text-ink md:text-2xl">
            {site.email}
          </a>
        </div>
        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
          <p className="t-label mb-4 text-dim">Index</p>
          <ul className="space-y-2 text-[15px]">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-line text-muted hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="t-label mb-4 text-dim">Elsewhere</p>
          <ul className="space-y-2 text-[15px]">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link-line text-muted hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-16 md:mt-24">
        <p
          ref={mark}
          aria-hidden="true"
          className="t-display origin-bottom select-none text-center text-[27vw] leading-[0.78] tracking-[-0.02em] text-ink"
        >
          MIRA
        </p>
      </div>

      <div className="flex flex-col gap-2 border-t border-hairline py-6 md:flex-row md:justify-between">
        <p className="t-label text-dim">© {year} Mira Technologies</p>
        <p className="t-label text-dim">miratechnologies.com</p>
      </div>
    </footer>
  );
}
