import { ArrowUpRight, MessageCircle, Plus } from "lucide-react";
import { Chapter, Head, Bezel } from "@/components/site/chapter";
import { waLink } from "@/lib/site";

const faqs = [
  { q: "¿Cómo reservo un servicio?", a: "Elegí el servicio, escribinos por WhatsApp y coordinamos día, hora y profesional para tu domicilio." },
  { q: "¿Trabajan en mi zona?", a: "Contanos tu ciudad o barrio y te confirmamos la disponibilidad de profesionales cerca tuyo." },
  { q: "¿Cómo me uno como profesional?", a: "Registrate desde la sección de membresía eligiendo “Soy profesional” y nuestro equipo se comunica con vos." },
  { q: "¿Cómo funciona la billetera virtual?", a: "Cargás saldo y lo usás para pagar servicios y compras. Podés ver cada movimiento desde tu cuenta." },
];

export function Atencion() {
  return (
    <Chapter id="atencion" bg="c" flip pos="60% 50%">
      <Head eyebrow="Atención al cliente" sub="Consultas, reservas o ayuda con tu cuenta. Te respondemos de forma personal.">
        Estamos <em className="text-amethyst">a un mensaje.</em>
      </Head>

      <div className="rise mt-16 grid gap-4 sm:mt-20 lg:grid-cols-2 lg:gap-6">
        <Bezel inner="relative flex min-h-[26rem] flex-col items-center justify-center overflow-hidden p-8 text-center sm:p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/marble-d.jpg" alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-70" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(10,7,9,.2),rgba(10,7,9,.85))]" />
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark.png" alt="" width={96} height={96} className="mx-auto size-20 object-contain" />
            <p className="mt-6 font-display text-4xl leading-tight text-cream sm:text-5xl">Hablemos por <em className="text-gold">WhatsApp.</em></p>
            <a href={waLink("Hola DRESA, necesito ayuda.")} target="_blank" rel="noopener noreferrer" className="btn-gold mt-8">
              <MessageCircle className="size-4" strokeWidth={1.5} /> Escribinos
              <span className="grid size-7 place-items-center rounded-full bg-ink-950/15"><ArrowUpRight className="size-3.5" strokeWidth={1.6} /></span>
            </a>
          </div>
        </Bezel>

        <Bezel inner="p-3 sm:p-6">
          <div className="divide-y divide-gold-500/20">
            {faqs.map((f) => (
              <details key={f.q} className="group px-3">
                <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center justify-between gap-6 font-display text-xl text-cream marker:hidden sm:text-2xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="size-5 shrink-0 text-gold-400 transition-transform duration-500 ease-lux group-open:rotate-45" strokeWidth={1.2} />
                </summary>
                <p className="pb-6 text-cream/65">{f.a}</p>
              </details>
            ))}
          </div>
        </Bezel>
      </div>
    </Chapter>
  );
}
