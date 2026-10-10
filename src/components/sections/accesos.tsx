import type { ComponentType } from "react";
import { Headset, Network, Quote, Share2, ShoppingBag, UserPlus, Wallet, ArrowUpRight } from "lucide-react";
import { accesos } from "@/lib/site";
import { Chapter, Head, Bezel } from "@/components/site/chapter";

const icons: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  registro: UserPlus, recomendar: Share2, red: Network, carrito: ShoppingBag,
  billetera: Wallet, testimonios: Quote, atencion: Headset,
};

export function Accesos() {
  return (
    <Chapter id="accesos" bg="a" pos="55% 50%" className="!py-24 sm:!py-32">
      <Head eyebrow="Accesos" sub="Todo lo que necesitás, a un toque.">
        Tu mundo <em className="text-gold">DRESA.</em>
      </Head>

      <ul className="mt-14 flex flex-wrap justify-center gap-3 sm:mt-16 sm:gap-5">
        {accesos.map((a, i) => {
          const Icon = icons[a.id];
          return (
            <li key={a.id} className="rise basis-[calc(50%-.375rem)] sm:basis-[calc(33.333%-.85rem)] lg:basis-[calc(25%-1rem)]">
              <a href={`#${a.id}`} className="group block h-full transition-transform duration-700 ease-lux hover:-translate-y-1.5">
                <Bezel className="h-full" inner="flex h-full flex-col items-center px-4 pb-6 pt-8 text-center sm:pb-8 sm:pt-10">
                  <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "radial-gradient(70% 60% at 50% 0%, rgba(149,88,202,.32), transparent 70%)" }} />
                  <span className="relative grid size-[4.5rem] place-items-center rounded-full p-px sm:size-24"
                    style={{ background: "conic-gradient(from 200deg, #d5b384, #9558ca, #d5b384)" }}>
                    <span className="grid size-full place-items-center rounded-full bg-ink-900 text-gold-200 transition-colors duration-500 group-hover:text-violet-300">
                      <Icon className="size-7 sm:size-9" strokeWidth={0.9} />
                    </span>
                  </span>
                  <span className="relative mt-5 font-caps text-[.58rem] tracking-[.3em] text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="relative mt-2 font-display text-[1.35rem] leading-[1.05] text-cream [overflow-wrap:normal] sm:text-[1.9rem]">{a.label}</h3>
                  <p className="relative mt-2 text-[.8rem] text-cream/55 sm:text-sm">{a.desc}</p>
                  <span className="relative mt-auto grid size-8 place-items-center rounded-full bg-gold-400/15 text-gold-300 transition-transform duration-500 ease-lux group-hover:-translate-y-px group-hover:translate-x-1 mt-5">
                    <ArrowUpRight className="size-4" strokeWidth={1.3} />
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
