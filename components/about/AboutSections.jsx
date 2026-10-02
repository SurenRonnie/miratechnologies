"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { onReady } from "@/components/ui/Preloader";
import SectionLabel from "@/components/ui/SectionLabel";
import MaskLines from "@/components/ui/MaskLines";
import Button from "@/components/ui/Button";
import FloatObject from "@/components/scene/FloatObject";

export function AboutHero() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      gsap.set(q("[data-line]"), { yPercent: 115 });
      gsap.set(q("[data-fade]"), { opacity: 0, y: 14 });
    }, root);
    const stop = onReady(() =>
      ctx.add(() => {
        gsap
          .timeline({ delay: 0.3 })
          .to(q("[data-line]"), { yPercent: 0, duration: 1.3, stagger: 0.1, ease: "expo.out" })
          .to(q("[data-fade]"), { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, "-=0.8");
        gsap.to(q("[data-hero-content]"), {
          yPercent: -30,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 25%", scrub: 1 },
        });
      })
    );
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section id="about-hero" ref={root} data-phase="MINIMUM" className="relative z-10 flex h-[100svh] min-h-[620px] items-end overflow-hidden px-[var(--gutter)] pb-[12vh]">
      <FloatObject
        src="/objects/growth.webp"
        className="left-[40vw] top-[13vh] w-[18vw] min-w-[110px] max-w-[260px]"
        depth={0.6}
        spin={8}
        sizes="(min-width: 768px) 14vw, 25vw"
      />
      <div data-hero-content className="relative w-full">
        <p data-fade className="t-label text-dim">
          About <span className="px-1 opacity-60">/</span> Mira Technologies
        </p>
        <h1 className="t-display mt-6 text-[clamp(2.4rem,8.4vw,9rem)] leading-[0.95] text-ink">
          <span className="mask-line"><span data-line>ABOUT</span></span>
          <span className="mask-line"><span data-line>MIRA</span></span>
        </h1>
        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <p data-fade className="max-w-md text-[15px] leading-relaxed text-muted md:col-span-5">
            A service studio of strategists, designers, engineers and marketers. We build the product, then we stay to make it grow.
          </p>
          <div data-fade className="md:col-span-3 md:col-start-10 md:justify-self-end">
            <Button href="/contact-us">Work with us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const STORY =
  "Mira started as a handful of engineers shipping storefronts for friends. Clients kept coming back with harder problems: an exchange that had to settle in milliseconds, a dating app that had to feel human, a campaign that had to pay for itself. So we grew into the studio those problems needed.";

export function AboutStory() {
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
        { opacity: 1, ease: "none", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 } }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about-story" ref={root} data-phase="RISING" className="relative z-10 h-[240vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-[var(--gutter)]">
        <FloatObject
          src="/objects/layers.webp"
          className="right-[2vw] top-[6vh] w-[18vw] min-w-[120px] max-w-[280px]"
          depth={0.8}
          spin={-8}
          trigger="#about-story"
        />
        <div className="relative grid w-full gap-8 md:grid-cols-12">
          <SectionLabel index="01" className="md:col-span-2 md:pt-3">
            Origin
          </SectionLabel>
          <p className="t-statement text-ink md:col-span-9 md:col-start-4">
            {STORY.split(" ").map((w, i) => (
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

const STAGES = [
  { name: "Minimum", text: "Quiet work. Research, architecture and the decisions nobody sees but everybody feels later." },
  { name: "Rising", text: "Design and build in weekly increments. The product gets visibly brighter every sprint." },
  { name: "Maximum", text: "Launch. The moment everything was built for, rehearsed so it is uneventful." },
  { name: "Declining", text: "No product stays bright on its own. We measure, refine and start the next cycle." },
];

export function AboutName() {
  const root = useRef(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const idx = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
        setStage((prev) => (prev === idx ? prev : idx));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id="about-name" ref={root} data-phase="MAXIMUM" className="relative z-10 h-[400vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden px-[var(--gutter)] pb-12 pt-24 md:pb-24 md:pt-28">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionLabel index="02">The name</SectionLabel>
            <MaskLines lines={["WHY A", "VARIABLE STAR"]} className="t-display t-section mt-6 text-ink" />
          </div>
          <p className="max-w-sm self-end text-[15px] leading-relaxed text-muted md:col-span-4 md:col-start-9">
            Mira, Omicron Ceti, is a red giant that brightens and dims over roughly 330 days. Its name is Latin for
            “wonderful”. Good products move the same way: in cycles, and on purpose.
          </p>
        </div>

        <ol className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {STAGES.map((s, i) => (
            <li key={s.name} className="transition-opacity duration-700" style={{ opacity: i === stage ? 1 : 0.28 }}>
              <span className="block h-px w-full bg-hairline">
                <span
                  className="block h-px w-full origin-left bg-ink transition-transform duration-1000 ease-film"
                  style={{ transform: `scaleX(${i <= stage ? 1 : 0})` }}
                />
              </span>
              <p className="t-label mt-4 text-dim">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="t-display mt-2 text-[clamp(1rem,1.6vw,1.5rem)] text-ink">{s.name}</h3>
              <p className="mt-3 hidden max-w-xs text-[14px] leading-relaxed text-muted md:block">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const RECORD = [
  { title: "E-commerce platforms", text: "Storefronts, marketplaces and headless commerce with custom checkout and back-office tools." },
  { title: "Trading & exchange", text: "Crypto exchanges, order books, wallets and real-time market dashboards." },
  { title: "Marketing agency", text: "SEO, paid media, content and brand programmes we run for clients month after month." },
  { title: "Dating apps", text: "Matching, chat and safety features with motion that makes the app feel alive." },
  { title: "Shopping apps", text: "Catalogue, loyalty and checkout flows for iOS and Android." },
  { title: "AI & automation", text: "Agents, recommendation and vision features added to products already in market." },
];

export function AboutRecord() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-record]").forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll("[data-line]"),
          { yPercent: 110 },
          { yPercent: 0, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 92%", end: "top 70%", scrub: 0.8 } }
        );
        gsap.fromTo(
          row.querySelector("[data-rule]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: row, start: "top 95%", end: "top 65%", scrub: 0.8 } }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about-record" ref={root} data-phase="DECLINING" className="relative z-10 px-[var(--gutter)] py-28 md:py-40">
      <FloatObject
        src="/objects/laptop.webp"
        className="-right-[3vw] top-[4vh] w-[30vw] min-w-[170px] max-w-[460px]"
        depth={0.6}
        spin={10}
      />
      <div className="relative grid gap-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <SectionLabel index="03">Track record</SectionLabel>
          <MaskLines lines={["WHAT WE’VE", "ALREADY SHIPPED"]} className="t-display t-section mt-6 text-ink" />
        </div>
      </div>
      <ul className="relative mt-16 md:mt-24">
        {RECORD.map((r, i) => (
          <li key={r.title} data-record className={`relative grid gap-3 py-7 md:grid-cols-12 md:py-9 ${i % 2 ? "md:pl-[8vw]" : ""}`}>
            <span data-rule className="absolute inset-x-0 top-0 block h-px origin-left bg-hairline" />
            <span className="t-label text-dim md:col-span-1 md:pt-2">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="t-display text-[clamp(1.2rem,2.8vw,2.6rem)] text-ink md:col-span-6">
              <span className="mask-line"><span data-line>{r.title}</span></span>
            </h3>
            <p className="max-w-sm text-[15px] leading-relaxed text-muted md:col-span-4 md:col-start-9 md:pt-2">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const PRINCIPLES = [
  { title: "Senior hands only", text: "The people in the pitch are the people in the repo. No hand-off to a junior bench." },
  { title: "Ship weekly", text: "Every week ends with something you can click. Progress you can see beats progress you are told about." },
  { title: "Numbers over noise", text: "Every project starts with the metric it has to move, and ends by moving it." },
  { title: "Stay after launch", text: "Most of our work is with clients we have had for years. Launch is the middle of the story." },
];

export function AboutPrinciples() {
  return (
    <section id="about-principles" data-phase="DECLINING" className="relative z-10 px-[var(--gutter)] py-28 md:py-40">
      <FloatObject
        src="/objects/chip.webp"
        className="left-[2vw] top-[30vh] hidden w-[16vw] max-w-[240px] md:block"
        depth={0.7}
        spin={-10}
      />
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-6 md:col-start-4">
          <SectionLabel index="04">Principles</SectionLabel>
          <MaskLines lines={["HOW WE", "WORK"]} className="t-display t-section mt-6 text-ink" />
        </div>
      </div>
      <div className="mt-16 grid gap-x-10 gap-y-14 md:mt-24 md:grid-cols-12">
        {PRINCIPLES.map((p, i) => (
          <article
            key={p.title}
            className={`border-t border-hairline pt-6 md:col-span-4 ${
              ["md:col-start-4", "md:col-start-9 md:mt-24", "md:col-start-4", "md:col-start-9 md:mt-24"][i]
            }`}
          >
            <p className="t-label text-dim">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="t-display mt-3 text-[clamp(1.1rem,1.8vw,1.7rem)] text-ink">{p.title}</h3>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AboutCta() {
  return (
    <section id="about-cta" data-phase="MINIMUM" className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-[var(--gutter)] py-32 text-center">
      <FloatObject
        src="/objects/plane.webp"
        className="left-[6vw] top-[12vh] w-[22vw] min-w-[130px] max-w-[340px]"
        depth={0.5}
        spin={10}
      />
      <MaskLines
        lines={["YOUR PRODUCT,", "AT MAXIMUM."]}
        className="t-display text-[clamp(2rem,6.4vw,7rem)] text-ink"
        start="top 85%"
        end="top 40%"
      />
      <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted">Tell us where it is in the cycle. We will tell you how we would brighten it.</p>
      <div className="mt-10">
        <Button href="/contact-us">Start a project</Button>
      </div>
    </section>
  );
}
