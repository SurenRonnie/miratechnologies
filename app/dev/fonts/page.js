import { Michroma, Syncopate, Unbounded, Tektur, Orbitron, Zen_Dots, Krona_One, Audiowide } from "next/font/google";

// Font specimen: compare wide display faces against the reference and pick one.
const f1 = Syncopate({ subsets: ["latin"], weight: "700" });
const f2 = Michroma({ subsets: ["latin"], weight: "400" });
const f3 = Krona_One({ subsets: ["latin"], weight: "400" });
const f4 = Unbounded({ subsets: ["latin"], weight: "600" });
const f5 = Tektur({ subsets: ["latin"], weight: "700" });
const f6 = Orbitron({ subsets: ["latin"], weight: "700" });
const f7 = Zen_Dots({ subsets: ["latin"], weight: "400" });
const f8 = Audiowide({ subsets: ["latin"], weight: "400" });

const faces = [
  ["Syncopate 700 (in use)", f1],
  ["Michroma", f2],
  ["Krona One", f3],
  ["Unbounded 600", f4],
  ["Tektur 700", f5],
  ["Orbitron 700", f6],
  ["Zen Dots", f7],
  ["Audiowide", f8],
];

export const metadata = { title: "Font specimen", robots: { index: false } };

export default function Fonts() {
  return (
    <main className="relative z-10 min-h-screen bg-space px-[var(--gutter)] pb-24 pt-28">
      <p className="t-label text-dim">Dev / Display font specimen</p>
      <ul className="mt-10 divide-y divide-white/10">
        {faces.map(([name, font]) => (
          <li key={name} className="py-8">
            <p className="t-label mb-3 text-dim">{name}</p>
            <p className={`${font.className} text-[clamp(1.8rem,5vw,5rem)] uppercase leading-none text-ink`}>
              MIRA — BUILT TO BRIGHTEN
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
