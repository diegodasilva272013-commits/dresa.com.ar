"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chapter, Head, Bezel } from "@/components/site/chapter";
import { waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

// Testimonios de muestra: reemplazar por los reales de clientes.
const items = [
  { q: "Llegó con todo, armó su rincón en mi living y fue como estar en un salón de lujo. Sin traslados, sin apuros.", who: "Cliente de Peluquería", i: "M" },
  { q: "Puntualidad, prolijidad y un resultado impecable. Ya reservo cada mes para toda la familia.", who: "Cliente de Barbería y Uñas", i: "L" },
  { q: "Como profesional, la plataforma me trajo clientas nuevas y me ordenó la agenda. Un antes y un después.", who: "Profesional de Maquillaje", i: "S" },
  { q: "El masaje en casa, un viernes a la noche, es el mejor regalo que me hice este año.", who: "Cliente de Masajes", i: "A" },
];

export function Testimonios() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [paused]);
  const go = (d: number) => setI((x) => (x + d + items.length) % items.length);

  return (
    <Chapter id="testimonios" bg="a" pos="20% 50%" tone="gold">
      <Head eyebrow="Testimonio">
        Lo dicen <em className="text-gold">ellas y ellos.</em>
      </Head>

      <Bezel
        className="rise mx-auto mt-14 max-w-4xl sm:mt-20"
        inner="px-6 py-12 text-center sm:px-16 sm:py-20"
      >
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-live="polite">
          <div className="grid">
            {items.map((t, k) => (
              <figure
                key={k} aria-hidden={k !== i}
                className={cn("col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-700 ease-lux",
                  k === i ? "translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-5 opacity-0")}
              >
                <blockquote className="font-display text-[1.65rem] leading-[1.25] text-cream sm:text-4xl">“{t.q}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 font-caps text-ink-950">{t.i}</span>
                  <span className="eyebrow">{t.who}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full border border-gold-500/40 text-gold-200 transition-colors hover:bg-gold-400/10" aria-label="Anterior"><ChevronLeft className="size-5" strokeWidth={1.3} /></button>
          <div className="flex" role="tablist" aria-label="Elegir testimonio">
            {items.map((_, k) => (
              <button key={k} role="tab" aria-selected={k === i} aria-label={`Testimonio ${k + 1}`} onClick={() => setI(k)} className="grid h-11 w-9 place-items-center">
                <span className={cn("h-0.5 rounded transition-all duration-500 ease-lux", k === i ? "w-8 bg-gold-300" : "w-4 bg-gold-600/50")} />
              </button>
            ))}
          </div>
          <button onClick={() => go(1)} className="grid size-12 place-items-center rounded-full border border-gold-500/40 text-gold-200 transition-colors hover:bg-gold-400/10" aria-label="Siguiente"><ChevronRight className="size-5" strokeWidth={1.3} /></button>
        </div>
      </Bezel>

      <div className="mt-10 text-center">
        <a href={waLink("Hola DRESA, quiero dejar mi testimonio.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">Dejá tu testimonio</a>
      </div>
    </Chapter>
  );
}
