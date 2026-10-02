"use client";

import { useState } from "react";
import Link from "next/link";
import MenuOverlay from "./MenuOverlay";
import Magnetic from "./Magnetic";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-[var(--gutter)] pt-5 mix-blend-difference md:pt-7">
        <Link
          href="/"
          className="t-display pointer-events-auto text-[13px] tracking-[0.18em] text-ink"
          aria-label="Mira Technologies, home"
        >
          MIRA
        </Link>
        <Magnetic strength={5} className="pointer-events-auto">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-ink transition-colors duration-500 hover:border-white/70"
          >
            <span className="relative block h-[7px] w-[14px]">
              <span
                className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-film"
                style={{ transform: open ? "translateY(3px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-film"
                style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </Magnetic>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
