import { services } from "@/lib/site";

export function Manifiesto() {
  const row = [...services, ...services];
  return (
    <section aria-label="Manifiesto" className="relative overflow-hidden border-y border-gold-500/20 bg-ink-900 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="eyebrow rise">Nuestra promesa</p>
        <p className="rise mt-6 font-display text-[1.9rem] leading-[1.15] text-cream sm:text-5xl lg:text-6xl">
          Llevamos el <em className="text-gold">salón, el spa y el estilista</em> hasta tu puerta.{" "}
          <span className="text-cream/50">Con el cuidado de una experiencia de lujo, a la hora que vos elijas.</span>
        </p>
      </div>
      <div className="mt-16 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden>
        <div className="flex w-max gap-12 whitespace-nowrap font-caps text-sm uppercase tracking-[.4em] text-gold-400/80" style={{ animation: "marquee 40s linear infinite" }}>
          {row.map((s, i) => (
            <span key={i} className="flex items-center gap-12">
              {s.name}
              <span className="size-1.5 rotate-45 bg-violet-500" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
