import SceneLayer from "@/components/scene/SceneLayer";
import PhaseReadout from "@/components/ui/PhaseReadout";
import Footer from "@/components/ui/Footer";
import {
  AboutHero,
  AboutStory,
  AboutName,
  AboutRecord,
  AboutPrinciples,
  AboutCta,
} from "@/components/about/AboutSections";

export const metadata = {
  title: "About us",
  description:
    "Mira Technologies is a service studio of strategists, designers, engineers and marketers building e-commerce, trading, mobile and marketing products.",
};

// The star runs one full cycle down this page: dim, rising, maximum, declining, then the surface.
const KEYS = [
  { at: { id: "about-hero", p: 0 }, state: { star: { o: 1, s: 0.95, x: 24, y: 0 }, pulse: 0.9 } },
  { at: { id: "about-story", p: 0 }, state: { star: { o: 0.55, s: 0.8, x: -24, r: 20 }, pulse: 1.05 } },
  { at: { id: "about-story", p: 1 }, state: { star: { o: 0.55, s: 0.85, x: -24, r: 40 }, pulse: 1.15 } },
  { at: { id: "about-name", p: 0 }, state: { star: { o: 0.9, s: 0.42, x: 0, y: -2, r: 50 }, starMax: { o: 0 }, pulse: 1.2 } },
  { at: { id: "about-name", p: 0.62 }, state: { star: { s: 0.5, y: -2, r: 70 }, starMax: { o: 0.9 }, pulse: 1.6 } },
  { at: { id: "about-name", p: 1 }, state: { star: { o: 0.7, s: 0.42, y: -2, r: 90 }, starMax: { o: 0 }, pulse: 1.0 } },
  { at: { id: "about-record", p: 0.2 }, state: { star: { o: 0.25, s: 0.6, x: -38, y: 0 }, tail: { o: 0.85, x: 0 }, pulse: 0.95 } },
  { at: { id: "about-principles", p: 0.5 }, state: { star: { o: 0 }, tail: { o: 0.3, x: -50 }, planet: { o: 0, s: 1.1, y: 30 } } },
  { at: { id: "about-cta", p: 0 }, state: { tail: { o: 0 }, planet: { o: 1, s: 1, y: 0 }, pulse: 0.85 } },
  { at: { id: "site-footer", p: "enter" }, state: { planet: { o: 0, s: 1.8, y: 20 }, surface: { o: 1, s: 1.05 } } },
  { at: { id: "site-footer", p: 1 }, state: { surface: { o: 1, s: 1 }, pulse: 0.7 } },
];

export default function AboutPage() {
  return (
    <>
      <SceneLayer keys={KEYS} />
      <PhaseReadout />
      <main className="relative">
        <AboutHero />
        <AboutStory />
        <AboutName />
        <AboutRecord />
        <AboutPrinciples />
        <AboutCta />
      </main>
      <Footer />
    </>
  );
}
