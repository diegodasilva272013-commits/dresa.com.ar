import type { ComponentType } from "react";
import { ArrowUpRight, Crown, Eye, Feather, Flower2, Gem, Brush, Hand, Scissors, Shirt, Sparkles } from "lucide-react";
import { services, waLink } from "@/lib/site";
import { Chapter, Head, Bezel } from "@/components/site/chapter";

const icons: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  peluqueria: Scissors, barberia: Crown, unas: Gem, maquillaje: Brush, "cejas-pestanas": Eye,
  masajes: Hand, estetica: Sparkles, "imagen-estilo": Shirt, cosmetologia: Flower2, depilacion: Feather,
};

export function Servicios() {
  return (
    <Chapter id="servicios" bg="c" pos="30% 50%">
      <Head eyebrow="Servicios a domicilio" sub="Diez especialidades, un mismo estándar. Elegí la tuya y coordinamos en tu casa.">
        Diez artes, <em className="text-amethyst">un solo</em> estándar.
      </Head>

      <ul className="mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:gap-5 lg:grid-cols-5">
        {services.map((s, i) => {
          const Icon = icons[s.id];
          return (
            <li key={s.id} className="rise">
              <a
                href={waLink(`Hola DRESA, quiero reservar ${s.name} a domicilio.`)}
                target="_blank" rel="noopener noreferrer"
                className="group block h-full transition-transform duration-700 ease-lux hover:-translate-y-2"
                aria-label={`Reservar ${s.name}`}
              >
                <Bezel className="h-full [border-radius:999px_999px_2rem_2rem]" inner="[border-radius:999px_999px_1.6rem_1.6rem] flex h-full min-h-[19rem] flex-col items-center px-4 pb-6 pt-14 text-center sm:min-h-[22rem] sm:pt-16">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: `radial-gradient(70% 55% at 50% 0%, rgba(149,88,202,.${30 + (i % 3) * 6}), transparent 70%)` }}
                  />
                  <span className="relative grid size-16 place-items-center rounded-full border border-gold-500/35 text-gold-300 transition-all duration-700 ease-lux group-hover:scale-110 group-hover:border-violet-400 group-hover:text-violet-300 sm:size-20">
                    <Icon className="size-7 sm:size-8" strokeWidth={1} />
                  </span>
                  <span className="relative mt-5 font-caps text-[.6rem] tracking-[.3em] text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="relative mt-2 font-display text-[1.65rem] leading-[1.05] text-cream sm:text-3xl">{s.name}</h3>
                  <p className="relative mt-3 hidden text-sm leading-relaxed text-cream/60 sm:block">{s.line}</p>
                  <span className="relative mt-auto inline-flex items-center gap-2 pt-6 text-[.66rem] uppercase tracking-[.2em] text-gold-300">
                    Reservar
                    <span className="grid size-7 place-items-center rounded-full bg-gold-400/15 transition-transform duration-500 ease-lux group-hover:-translate-y-px group-hover:translate-x-1">
                      <ArrowUpRight className="size-3.5" strokeWidth={1.4} />
                    </span>
                  </span>
                </Bezel>
              </a>
            </li>
          );
        })}
      </ul>
    </Chapter>
  );
}
