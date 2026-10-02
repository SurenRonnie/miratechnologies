"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { projects } from "@/data/projects";
import SectionLabel from "@/components/ui/SectionLabel";

// Vertical scroll drives a horizontal strip of oversized panels over Mira's gas tail.
export default function Work() {
  const root = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const section = root.current;
    const strip = track.current;
    const panels = [...strip.querySelectorAll("[data-panel]")];
    const reduce = prefersReducedMotion();

    const size = () => {
      const distance = strip.scrollWidth - window.innerWidth;
      section.style.height = `${distance + window.innerHeight}px`;
      return distance;
    };
    let distance = size();

    const render = (progress) => {
      const x = -progress * distance;
      strip.style.transform = `translate3d(${x}px,0,0)`;
      const center = window.innerWidth / 2;
      panels.forEach((p) => {
        const r = p.getBoundingClientRect();
        const d = Math.min(Math.abs(r.left + r.width / 2 - center) / window.innerWidth, 1);
        const card = p.firstElementChild;
        card.style.transform = `scale(${1 - d * 0.08})`;
        const art = p.querySelector("[data-art]");
        if (art && !reduce) art.style.transform = `translate3d(${(r.left + r.width / 2 - center) * -0.12}px,0,0) rotate(${(r.left - center) * 0.012}deg)`;
      });
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onRefreshInit: () => {
        distance = size();
      },
      onUpdate: (self) => render(self.progress),
    });
    render(0);
    return () => st.kill();
  }, []);

  return (
    <section id="work" ref={root} data-phase="RISING" className="relative z-10">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div ref={track} className="flex items-center gap-[4vw] pl-[var(--gutter)] pr-[12vw] will-change-transform">
          <div className="flex w-[78vw] shrink-0 flex-col justify-center md:w-[38vw]">
            <SectionLabel index="03">Selected work</SectionLabel>
            <h2 className="t-display t-section mt-6 text-ink">
              PRODUCTS
              <br />
              IN ORBIT
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
              Commerce, exchanges, dating and shopping apps, and the campaigns behind them. Keep scrolling.
            </p>
          </div>

          {projects.map((p, i) => (
            <article key={p.id} data-panel className="w-[82vw] shrink-0 md:w-[54vw]">
              <div className="relative flex h-[66svh] flex-col justify-between overflow-hidden border border-hairline bg-black/30 p-5 backdrop-blur-[2px] transition-colors duration-500 hover:border-white/35 md:p-8">
                <div className="flex items-start justify-between">
                  <span className="t-label text-dim">{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                  <span className="t-label text-dim">{p.year}</span>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div data-art className="w-[58%] max-w-[460px] will-change-transform md:w-[42%]">
                    <Image src={p.object} alt="" width={1100} height={1100} sizes="(min-width: 768px) 24vw, 50vw" className="h-auto w-full" />
                  </div>
                </div>
                <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="t-label text-ember">{p.kind}</p>
                    <h3 className="t-display mt-2 text-[clamp(1.4rem,3.2vw,3rem)] text-ink">{p.title}</h3>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li key={t} className="t-label rounded-full border border-hairline px-3 py-1.5 text-[10px] text-muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
