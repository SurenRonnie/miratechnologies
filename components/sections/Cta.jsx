import { site } from "@/data/site";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/ui/Magnetic";
import MaskLines from "@/components/ui/MaskLines";
import SectionLabel from "@/components/ui/SectionLabel";
import FloatObject from "@/components/scene/FloatObject";

// Arrival: the surface plate rises in the scene behind this section.
export default function Cta() {
  return (
    <section id="cta" data-phase="MINIMUM" className="relative z-10 flex min-h-[110svh] flex-col justify-center px-[var(--gutter)] py-32">
      <FloatObject
        src="/objects/plane.webp"
        className="right-[5vw] top-[8vh] w-[28vw] min-w-[150px] max-w-[430px]"
        depth={0.55}
        spin={10}
      />
      <SectionLabel index="07">Contact</SectionLabel>
      <MaskLines
        lines={["LET’S BUILD", "SOMETHING THAT", "STAYS LIT."]}
        className="t-display mt-8 text-[clamp(2rem,6.4vw,7rem)] text-ink"
        start="top 85%"
        end="top 35%"
      />
      <div className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-center md:gap-12">
        <Magnetic strength={10}>
          <a href={`mailto:${site.email}`} className="link-line text-[clamp(1.2rem,2.4vw,2.2rem)] text-ink">
            {site.email}
          </a>
        </Magnetic>
        <Button href="/contact-us">Start a project</Button>
      </div>
    </section>
  );
}
