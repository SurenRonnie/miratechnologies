"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/motion";
import { site } from "@/data/site";

// Full-screen menu: a circle of black opens from the menu button, links rise line by line.
export default function MenuOverlay({ open, onClose }) {
  const root = useRef(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const el = root.current;
    const lenis = window.__lenis;
    const links = el.querySelectorAll("[data-menu-line]");
    const meta = el.querySelectorAll("[data-menu-meta]");

    if (first.current) {
      first.current = false;
      gsap.set(el, { clipPath: "circle(0% at calc(100% - 3.5rem) 3.2rem)", visibility: "hidden" });
      return;
    }

    if (open) {
      lenis?.stop();
      gsap
        .timeline()
        .set(el, { visibility: "visible" })
        .to(el, { clipPath: "circle(150% at calc(100% - 3.5rem) 3.2rem)", duration: 1.1, ease: "expo.inOut" })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: "expo.out" }, 0.45)
        .fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.05 }, 0.7);
    } else {
      lenis?.start();
      gsap
        .timeline()
        .to(links, { yPercent: -110, duration: 0.5, stagger: 0.03, ease: "power3.in" })
        .to(el, { clipPath: "circle(0% at calc(100% - 3.5rem) 3.2rem)", duration: 0.8, ease: "expo.inOut" }, 0.2)
        .set(el, { visibility: "hidden" });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleNav = (e, href) => {
    const [path, hash] = href.split("#");
    if (hash && (path || "/") === pathname) {
      e.preventDefault();
      onClose();
      setTimeout(() => scrollToTarget(`#${hash}`), 450);
      return;
    }
    onClose();
  };

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className="fixed inset-0 z-[70] overflow-hidden bg-space"
    >
      {/* the star at minimum, waiting behind the menu */}
      <img
        src="/space/mira-star-min.2k.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20vmin] top-1/2 w-[110vmin] -translate-y-1/2 opacity-70 mix-blend-screen"
      />
      <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] pb-8 pt-28 md:pt-32">
        <nav aria-label="Primary">
          <ul className="space-y-1 md:space-y-2">
            {site.nav.map((item, i) => (
              <li key={item.href} className="flex items-baseline gap-4 md:gap-8">
                <span data-menu-meta className="t-label w-8 text-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mask-line">
                  <span data-menu-line>
                    <Link
                      href={item.href}
                      onClick={(e) => handleNav(e, item.href)}
                      className="t-display group inline-block text-[clamp(2.2rem,7vw,6.5rem)] text-ink transition-colors duration-500 hover:text-ember"
                      tabIndex={open ? 0 : -1}
                    >
                      {item.label}
                    </Link>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-6 border-t border-hairline pt-6 md:flex-row md:items-end md:justify-between">
          <a data-menu-meta href={`mailto:${site.email}`} className="link-line text-lg text-ink" tabIndex={open ? 0 : -1}>
            {site.email}
          </a>
          <ul data-menu-meta className="flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="t-label link-line text-muted hover:text-ink"
                  tabIndex={open ? 0 : -1}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
