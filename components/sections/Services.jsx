"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { services } from "@/data/services";
import SectionLabel from "@/components/ui/SectionLabel";
import MaskLines from "@/components/ui/MaskLines";
import FloatObject from "@/components/scene/FloatObject";

// Pinned index list. The service at the centre is lit, the rest dim. Scroll walks the list.
export default function Services() {
  const root = useRef(null);
  const list = useRef(null);
  const obj = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rows = list.current.querySelectorAll("[data-row]");
    const n = services.length;
    const reduce = prefersReducedMotion();

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const f = self.progress * (n - 1);
        const idx = Math.round(f);
        setActive((prev) => (prev === idx ? prev : idx));
        const rowH = rows[0].offsetHeight;
        gsap.to(list.current, { y: -f * rowH, duration: reduce ? 0 : 0.6, ease: "power3.out", overwrite: true });
        rows.forEach((row, i) => {
          const d = Math.min(Math.abs(i - f), 2);
          row.style.opacity = String(1 - d * 0.42);
        });
        if (obj.current) obj.current.style.transform = `rotate(${Math.sin(self.progress * Math.PI * 4) * 6}deg)`;
      },
    });
    return () => st.kill();
  }, []);

  const s = services[active];

  return (
    <section id="services" ref={root} data-phase="RISING" className="relative z-10 h-[420vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-[var(--gutter)] pt-24 md:pt-28">
        <div className="flex items-end justify-between gap-6">
          <MaskLines lines={["WHAT WE", "BUILD"]} className="t-display t-section text-ink" />
          <SectionLabel index="02" className="hidden md:block">
            Services
          </SectionLabel>
        </div>

        <div className="relative mt-8 grid flex-1 gap-8 md:mt-12 md:grid-cols-12">
          {/* index list, centred on the active row */}
          <div className="relative h-[40vh] overflow-hidden md:col-span-7 md:h-auto">
            <ol ref={list} className="absolute inset-x-0 top-[calc(50%-2.5rem)] md:top-[calc(50%-3.5rem)]">
              {services.map((item) => (
                <li
                  key={item.id}
                  data-row
                  className="flex h-20 items-center gap-5 border-b border-hairline transition-opacity duration-300 md:h-28 md:gap-8"
                >
                  <span className="t-label w-8 text-dim">{item.index}</span>
                  <span className="t-display text-[clamp(1.1rem,3vw,2.9rem)] text-ink">{item.title}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* detail column: obsidian shard turns with the list */}
          <div className="relative md:col-span-4 md:col-start-9 md:self-center">
            {/* the object for the lit service; the others wait at zero opacity */}
            <div ref={obj} className="pointer-events-none absolute -top-[34vh] right-0 hidden aspect-square w-[19vw] max-w-[290px] md:block">
              {services.map((item, i) => (
                <div
                  key={item.id}
                  className="absolute inset-0 transition-[opacity,transform] duration-700 ease-film"
                  style={{ opacity: i === active ? 1 : 0, transform: `scale(${i === active ? 1 : 0.85})` }}
                >
                  <FloatObject src={item.object} className="inset-0 w-full" depth={0.5} spin={0} trigger="#services" sizes="19vw" />
                </div>
              ))}
            </div>
            <div key={s.id} className="animate-[svcIn_0.8s_var(--ease-out)_both]">
              <p className="t-label text-ember">{s.index} — {String(services.length).padStart(2, "0")}</p>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted md:text-[17px]">{s.summary}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <li key={t} className="t-label rounded-full border border-hairline px-3 py-1.5 text-[10px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes svcIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
