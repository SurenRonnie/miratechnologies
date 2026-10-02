import SceneLayer from "@/components/scene/SceneLayer";
import PhaseReadout from "@/components/ui/PhaseReadout";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import Stack from "@/components/sections/Stack";
import Numbers from "@/components/sections/Numbers";
import Cta from "@/components/sections/Cta";

/*
  The home page is one Mira brightness cycle:
  Minimum (hero) -> Rising (statement, services, work) -> Maximum (process)
  -> Declining (stack, numbers) -> Minimum (cta, footer).
  Each key below positions the 4K plates; see SceneLayer.jsx for the format.
*/
const KEYS = [
  { at: { id: "hero", p: 0 }, state: { planet: { o: 1, s: 1, y: 0 }, star: { o: 0, s: 0.55, x: 16 }, pulse: 0.85 } },
  // dolly into the atmosphere
  { at: { id: "statement", p: 0 }, state: { planet: { o: 0, s: 2.6, y: 22 }, star: { o: 0.6, s: 0.75, x: 22, r: 0 }, pulse: 1.0 } },
  { at: { id: "statement", p: 1 }, state: { star: { o: 0.7, s: 0.9, x: 22, r: 18 }, pulse: 1.15 } },
  // services: the star slides left and rolls per step
  { at: { id: "services", p: 0 }, state: { star: { o: 0.55, s: 0.85, x: -24, r: 30 }, pulse: 1.1 } },
  { at: { id: "services", p: 1 }, state: { star: { o: 0.55, s: 1.0, x: -24, r: 90 }, tail: { o: 0.2, x: 0 }, pulse: 1.3 } },
  // work: Mira's gas tail streams past the track
  { at: { id: "work", p: 0 }, state: { star: { o: 0.25, s: 0.7, x: -40 }, tail: { o: 0.95, x: 0 }, pulse: 1.2 } },
  { at: { id: "work", p: 1 }, state: { star: { o: 0.3, s: 0.7, x: -40 }, tail: { o: 0.9, x: -55 }, pulse: 1.2 } },
  // light flood: the star swells and brightens to maximum
  { at: { id: "process", p: "enter" }, state: { star: { o: 0.7, s: 0.9, x: 0, r: 100 }, tail: { o: 0.5, x: -60 }, pulse: 1.3 } },
  { at: { id: "process", p: 0.14 }, state: { star: { o: 0.2, s: 3.2, x: 0, r: 110 }, starMax: { o: 1 }, tail: { o: 0 }, pulse: 1.6 } },
  { at: { id: "process", p: 0.84 }, state: { star: { o: 0.2, s: 2.6 }, starMax: { o: 1 }, pulse: 1.6 } },
  // declining
  { at: { id: "process", p: 1 }, state: { star: { o: 0.8, s: 0.8, x: 18, r: 130 }, starMax: { o: 0.3 }, pulse: 1.2 } },
  { at: { id: "stack", p: 1 }, state: { star: { o: 0.5, s: 0.6, x: 26 }, starMax: { o: 0 }, pulse: 0.95 } },
  { at: { id: "numbers", p: 0.6 }, state: { star: { o: 0.55, s: 0.5, x: 26, y: -6 }, tail: { o: 0.25, x: -20 }, pulse: 0.85 } },
  // arrival on the surface
  { at: { id: "cta", p: "enter" }, state: { star: { o: 0.5 }, tail: { o: 0 }, surface: { o: 0, s: 1.1, y: 10 } } },
  { at: { id: "cta", p: 0.5 }, state: { star: { o: 0, y: -20 }, surface: { o: 1, s: 1.06, y: 0 }, pulse: 0.8 } },
  { at: { id: "site-footer", p: 1 }, state: { surface: { o: 1, s: 1.0, y: 0 }, pulse: 0.7 } },
];

export default function Home() {
  return (
    <>
      <SceneLayer keys={KEYS} intro />
      <PhaseReadout />
      <main className="relative">
        <Hero />
        <Statement />
        <Services />
        <Work />
        <Process />
        <Stack />
        <Numbers />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
