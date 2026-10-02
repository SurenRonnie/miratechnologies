import SceneLayer from "@/components/scene/SceneLayer";
import Footer from "@/components/ui/Footer";
import SectionLabel from "@/components/ui/SectionLabel";
import MaskLines from "@/components/ui/MaskLines";
import FloatObject from "@/components/scene/FloatObject";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/data/site";

export const metadata = {
  title: "Contact us",
  description:
    "Start a project with Mira Technologies: web and e-commerce platforms, trading and exchange systems, mobile apps, marketing and AI integration.",
};

const KEYS = [
  { at: { id: "contact-hero", p: 0 }, state: { planet: { o: 1, s: 1, y: 0 }, star: { o: 0, s: 0.5, x: 28 }, pulse: 0.85 } },
  { at: { id: "contact-form", p: 0 }, state: { planet: { o: 0.0, s: 2.4, y: 24 }, star: { o: 0.45, s: 0.55, x: 38, y: -8 }, pulse: 1.0 } },
  { at: { id: "contact-form", p: 1 }, state: { star: { o: 0.4, s: 0.5, x: 40, y: -12, r: 40 } } },
  { at: { id: "site-footer", p: "enter" }, state: { star: { o: 0.2 }, surface: { o: 0.2, s: 1.1 } } },
  { at: { id: "site-footer", p: 1 }, state: { star: { o: 0 }, surface: { o: 1, s: 1 }, pulse: 0.7 } },
];

const STEPS = [
  "We reply within one working day.",
  "A 30-minute call to understand the product and the goal.",
  "A written proposal with scope, timeline and a fixed price per phase.",
];

export default function ContactPage() {
  return (
    <>
      <SceneLayer keys={KEYS} intro />
      <main className="relative">
        <ContactHero />

        <section id="contact-form" className="relative z-10 px-[var(--gutter)] pb-28 pt-12 md:pb-40">
          <FloatObject
            src="/objects/chat.webp"
            className="-left-[5vw] top-[64%] hidden w-[12vw] max-w-[200px] md:block"
            depth={0.6}
            spin={8}
          />
          <div className="grid gap-16 md:grid-cols-12">
            <aside className="md:col-span-4">
              <SectionLabel index="01">Enquiry</SectionLabel>
              <MaskLines lines={["START A", "PROJECT"]} className="t-display t-section mt-6 text-ink" />

              <dl className="mt-12 space-y-8">
                <div>
                  <dt className="t-label text-dim">Email</dt>
                  <dd className="mt-2">
                    <a href={`mailto:${site.email}`} className="link-line text-lg text-ink">
                      {site.email}
                    </a>
                  </dd>
                </div>
                {site.phone ? (
                  <div>
                    <dt className="t-label text-dim">Phone</dt>
                    <dd className="mt-2 text-lg text-ink">{site.phone}</dd>
                  </div>
                ) : null}
                {site.location ? (
                  <div>
                    <dt className="t-label text-dim">Studio</dt>
                    <dd className="mt-2 text-lg text-ink">{site.location}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="t-label text-dim">What happens next</dt>
                  <dd className="mt-3">
                    <ol className="space-y-3">
                      {STEPS.map((s, i) => (
                        <li key={s} className="flex gap-4 text-[15px] leading-relaxed text-muted">
                          <span className="t-label pt-1 text-dim">{String(i + 1).padStart(2, "0")}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </dd>
                </div>
              </dl>
            </aside>

            <div className="md:col-span-7 md:col-start-6 md:pt-24">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
