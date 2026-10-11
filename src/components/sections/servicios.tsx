import { ArrowUpRight } from "lucide-react";
import { services, waLink } from "@/lib/site";
import { Chapter, Head, Bezel } from "@/components/site/chapter";

export function Servicios() {
  return (
    <Chapter id="servicios" bg="c" pos="30% 50%">
      <Head eyebrow="Servicios a domicilio" sub="Diez especialidades, un mismo estándar. Elegí la tuya y coordinamos en tu casa.">
        Diez artes, <em className="text-amethyst">un solo</em> estándar.
      </Head>

      <ul className="mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:gap-5 lg:grid-cols-5">
        {services.map((s, i) => (
          <li key={s.id} className="rise">
            <a
              href={waLink(`Hola DRESA, quiero reservar ${s.name} a domicilio.`)}
              target="_blank" rel="noopener noreferrer"
              className="group block h-full transition-transform duration-700 ease-lux hover:-translate-y-1.5"
              aria-label={`Reservar ${s.name}`}
            >
              <Bezel className="h-full" inner="flex h-full flex-col">
                {/* Foto limpia: sin texto ni capas encima */}
                <div className="m-1.5 overflow-hidden rounded-[calc(2rem-.375rem-.375rem)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/services/${s.id}.webp`}
                    alt={`${s.name} a domicilio`}
                    width={720} height={900}
                    loading={i < 5 ? "eager" : "lazy"} decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-lux group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-4 pb-5 pt-3 text-center sm:px-5 sm:pb-6">
                  <h3 className="font-display text-[1.45rem] leading-[1.05] text-cream sm:text-[1.75rem]">{s.name}</h3>
                  <p className="mt-2 hidden text-[.85rem] leading-relaxed text-cream/65 sm:block">{s.line}</p>
                  <span className="mt-auto inline-flex items-center justify-center gap-2 pt-4 text-[.66rem] uppercase tracking-[.2em] text-gold-300">
                    Reservar
                    <span className="grid size-7 place-items-center rounded-full bg-gold-400/15 transition-transform duration-500 ease-lux group-hover:-translate-y-px group-hover:translate-x-1">
                      <ArrowUpRight className="size-3.5" strokeWidth={1.4} />
                    </span>
                  </span>
                </div>
              </Bezel>
            </a>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}
