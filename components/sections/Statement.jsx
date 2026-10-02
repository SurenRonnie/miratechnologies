"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import FloatObject from "@/components/scene/FloatObject";

const TEXT =
  "We design, engineer and grow digital products for companies that refuse to be ordinary. Storefronts that convert, exchanges that hold under load, apps people open twice a day — and the marketing that brings them in.";

// Pinned (sticky). Words brighten one by one as the star behind rises in brightness.
export default function Statement() {
  const root = useRef(null);

  useEffect(() => {
    const words = root.current.querySelectorAll("[data-word]");
    if (prefersReducedMotion()) {
      gsap.set(words, { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="statement" ref={root} data-phase="RISING" className="relative z-10 h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-[var(--gutter)]">
        <FloatObject
          src="/objects/laptop.webp"
          className="-left-[3vw] bottom-[8vh] w-[30vw] min-w-[160px] max-w-[440px]"
          depth={0.6}
          spin={10}
          trigger="#statement"
        />
        <div className="relative grid w-full gap-8 md:grid-cols-12">
          <SectionLabel index="01" className="md:col-span-2 md:pt-3">
            Statement
          </SectionLabel>
          <p className="t-statement text-ink md:col-span-9 md:col-start-4">
            {TEXT.split(" ").map((w, i) => (
              <span key={i} data-word className="inline-block opacity-[0.14]">
                {w}&nbsp;
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
