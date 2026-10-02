"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { services } from "@/data/services";
import { Roll } from "@/components/ui/Button";
import Magnetic from "@/components/ui/Magnetic";

const BUDGETS = ["< $10k", "$10k – 30k", "$30k – 80k", "$80k +", "Not sure yet"];

function Field({ label, name, error, as = "input", ...props }) {
  const Tag = as;
  return (
    <label className="block">
      <span className="t-label text-dim">{label}</span>
      <Tag name={name} className={`field ${as === "textarea" ? "min-h-[9rem] resize-none" : ""}`} aria-invalid={!!error} {...props} />
      <span className="mt-2 block min-h-[1rem] text-[12px] text-ember" role={error ? "alert" : undefined}>
        {error}
      </span>
    </label>
  );
}

function Chips({ label, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="t-label mb-3 text-dim">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className="chip"
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? "" : o)}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ContactForm() {
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const done = useRef(null);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(form), service, budget };
    setStatus("sending");
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErrors(data.errors || {});
        setMessage(data.error || (data.errors ? "Check the highlighted fields." : "Something went wrong."));
        setStatus("error");
        return;
      }
      setStatus("sent");
      requestAnimationFrame(() => {
        if (!done.current) return;
        gsap.fromTo(done.current.querySelectorAll("[data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" });
      });
    } catch {
      setMessage("Network error. Try again, or email us directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div ref={done} className="py-10" aria-live="polite">
        <h3 className="t-display text-[clamp(2rem,5vw,4.5rem)] text-ink">
          <span className="mask-line"><span data-line>RECEIVED.</span></span>
          <span className="mask-line"><span data-line className="text-muted">WE’LL BE IN TOUCH.</span></span>
        </h3>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
          Expect a reply within one working day, usually with a few questions and a time to talk.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" placeholder="Jane Doe" error={errors.name} required />
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="jane@company.com" error={errors.email} required />
        <Field label="Company (optional)" name="company" autoComplete="organization" placeholder="Company name" />
      </div>

      <Chips label="What do you need?" options={services.map((s) => s.title)} value={service} onChange={setService} />
      <Chips label="Budget" options={BUDGETS} value={budget} onChange={setBudget} />

      <Field
        as="textarea"
        label="About the project"
        name="message"
        placeholder="What are you building, and where is it today?"
        error={errors.message}
        required
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <Magnetic>
          <button type="submit" className="pill pill--solid h-12 px-8" disabled={status === "sending"}>
            <Roll>{status === "sending" ? "Sending…" : "Send enquiry"}</Roll>
          </button>
        </Magnetic>
        <p className="min-h-[1.25rem] text-[13px] text-muted" aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  );
}
