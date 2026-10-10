"use client";

import { useRef, useState, type PointerEvent } from "react";
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Plus } from "lucide-react";
import { Chapter, Head, Bezel } from "@/components/site/chapter";
import { cn } from "@/lib/utils";

type Mov = { id: number; t: string; amt: number; d: string };
const money = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function Billetera() {
  const card = useRef<HTMLDivElement>(null);
  const [hide, setHide] = useState(false);
  const [balance, setBalance] = useState(25000);
  const [movs, setMovs] = useState<Mov[]>([
    { id: 1, t: "Bonificación por referido", amt: 5000, d: "Hoy" },
    { id: 2, t: "Servicio · Uñas", amt: -12000, d: "Ayer" },
    { id: 3, t: "Carga de saldo", amt: 30000, d: "Hace 3 días" },
  ]);
  const [adding, setAdding] = useState(false);

  const tilt = (e: PointerEvent) => {
    const el = card.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
    el.style.setProperty("--sx", `${(x + 0.5) * 100}%`);
  };
  const reset = () => { if (card.current) card.current.style.transform = "perspective(900px) rotateY(0) rotateX(0)"; };
  const add = (n: number) => {
    setBalance((b) => b + n);
    setMovs((m) => [{ id: Date.now(), t: "Carga de saldo", amt: n, d: "Ahora" }, ...m].slice(0, 4));
    setAdding(false);
  };

  return (
    <Chapter id="billetera" bg="d" pos="50% 60%">
      <Head eyebrow="Billetera virtual" sub="Cargá saldo, pagá tus servicios y seguí cada movimiento desde tu celular.">
        Tu saldo, <em className="text-gold">siempre a mano.</em>
      </Head>

      <div className="rise mt-16 grid gap-4 sm:mt-20 lg:grid-cols-2 lg:gap-6">
        <Bezel inner="grid place-items-center px-5 py-12 sm:py-16">
          <div
            ref={card} onPointerMove={tilt} onPointerLeave={reset}
            className="relative aspect-[1.586] w-full max-w-md overflow-hidden rounded-[1.6rem] border border-gold-300/40 p-6 transition-transform duration-200 ease-out sm:p-8"
            style={{
              background: "radial-gradient(circle at var(--sx,30%) 0%, rgba(213,179,132,.38), transparent 45%), linear-gradient(135deg,#2a1640 0%,#12081c 55%,#2b2012 100%)",
              boxShadow: "0 50px 90px -30px rgba(149,88,202,.6), inset 0 1px 0 rgba(255,255,255,.2)",
              touchAction: "pan-y",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark.png" alt="" width={160} height={160} className="pointer-events-none absolute -bottom-3 -right-3 size-32 object-contain opacity-30 sm:size-40" />
            <div className="relative flex items-start justify-between">
              <span className="font-caps text-xs tracking-[.35em] text-gold-200">DRESA WALLET</span>
              <button onClick={() => setHide((h) => !h)} className="grid size-9 place-items-center rounded-full text-gold-300" aria-label={hide ? "Mostrar saldo" : "Ocultar saldo"}>
                {hide ? <EyeOff className="size-4" strokeWidth={1.3} /> : <Eye className="size-4" strokeWidth={1.3} />}
              </button>
            </div>
            <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
              <p className="text-[.65rem] uppercase tracking-[.25em] text-cream/55">Saldo disponible</p>
              <p className="mt-1 font-display text-5xl tabular-nums text-gold sm:text-6xl">{hide ? "••••••" : money(balance)}</p>
              <p className="mt-3 font-caps text-[.7rem] tracking-[.3em] text-cream/60">•••• •••• •••• 2026</p>
            </div>
          </div>
        </Bezel>

        <Bezel inner="flex flex-col p-6 sm:p-10">
          <button onClick={() => setAdding((a) => !a)} className="btn-gold w-full" aria-expanded={adding}>
            <Plus className="size-4" strokeWidth={1.6} /> Cargar saldo
          </button>
          <div className={cn("grid transition-all duration-500 ease-lux", adding ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
            <div className="overflow-hidden">
              <div className="grid grid-cols-2 gap-2">
                {[5000, 10000, 20000, 50000].map((n) => (
                  <button key={n} onClick={() => add(n)} tabIndex={adding ? 0 : -1} className="btn-ghost !min-h-11 !px-3 !text-[.7rem]">+ {money(n)}</button>
                ))}
              </div>
            </div>
          </div>

          <p className="eyebrow mt-8">Últimos movimientos</p>
          <ul className="mt-4 divide-y divide-gold-500/15">
            {movs.map((m) => (
              <li key={m.id} className="flex items-center gap-4 py-4">
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", m.amt > 0 ? "bg-violet-500/20 text-violet-300" : "bg-gold-400/15 text-gold-300")}>
                  {m.amt > 0 ? <ArrowDownLeft className="size-4" strokeWidth={1.4} /> : <ArrowUpRight className="size-4" strokeWidth={1.4} />}
                </span>
                <div className="min-w-0 flex-1"><p className="truncate">{m.t}</p><p className="text-xs text-cream/45">{m.d}</p></div>
                <span className={cn("tabular-nums", m.amt > 0 ? "text-violet-300" : "text-cream/80")}>{m.amt > 0 ? "+" : ""}{money(m.amt)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-4 text-xs text-cream/40">Vista de ejemplo: los movimientos son ilustrativos.</p>
        </Bezel>
      </div>
    </Chapter>
  );
}
