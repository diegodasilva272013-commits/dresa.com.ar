"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Chapter, Head, Bezel } from "@/components/site/chapter";
import { waLink } from "@/lib/site";

// Catálogo de muestra: reemplazar por los productos reales.
const products = [
  { id: "serum", name: "Sérum Iluminador", note: "Vitamina C · 30 ml", price: 48900 },
  { id: "mascara", name: "Máscara Capilar Nutritiva", note: "Karité y argán · 250 ml", price: 36500 },
  { id: "aceite", name: "Aceite de Argán Puro", note: "Brillo y reparación · 60 ml", price: 29900 },
  { id: "brochas", name: "Set de Brochas Atelier", note: "11 piezas · estuche", price: 54200 },
];
const money = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function Carrito() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const items = products.filter((p) => cart[p.id]);
  const count = items.reduce((a, p) => a + cart[p.id], 0);
  const total = items.reduce((a, p) => a + cart[p.id] * p.price, 0);
  const set = (id: string, d: number) =>
    setCart((c) => { const q = Math.max(0, (c[id] ?? 0) + d); const n = { ...c }; if (q) n[id] = q; else delete n[id]; return n; });

  const order = `Hola DRESA, quiero hacer este pedido:\n${items.map((p) => `• ${cart[p.id]} × ${p.name}`).join("\n")}\nTotal: ${money(total)}`;

  return (
    <Chapter id="carrito" bg="e" pos="85% 50%" tone="gold">
      <Head eyebrow="Carrito de compras" sub="Cosmética y accesorios seleccionados. Armá tu pedido y cerralo por WhatsApp.">
        Tu <em className="text-gold">carrito</em>, tu ritual.
      </Head>
      <div className="rise mt-10 flex justify-center">
        <button onClick={() => setOpen(true)} className="btn-ghost" aria-label={`Abrir carrito, ${count} productos`}>
          <ShoppingBag className="size-4" strokeWidth={1.3} /> Ver carrito · {count}
        </button>
      </div>
      <div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <article key={p.id} className="rise group"><Bezel className="h-full" inner="flex h-full flex-col">
              <div className="m-1.5 overflow-hidden rounded-[calc(2rem-.375rem-.375rem)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/products/${p.id}.webp`} alt={p.name} width={800} height={800} loading="lazy" decoding="async"
                  className="aspect-square w-full object-cover transition-transform duration-[900ms] ease-lux group-hover:scale-[1.05]" />
              </div>
              <div className="mt-auto p-4 sm:p-5">
                <h3 className="font-display text-xl leading-tight sm:text-2xl">{p.name}</h3>
                <p className="mt-1 text-xs text-cream/55">{p.note}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-gold-200">{money(p.price)}</span>
                  <button onClick={() => { set(p.id, 1); setOpen(true); }} className="grid size-11 place-items-center rounded-full bg-gold-400 text-ink-950 transition hover:scale-105 active:scale-95" aria-label={`Agregar ${p.name}`}>
                    <Plus className="size-5" />
                  </button>
                </div>
              </div>
            </Bezel></article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-cream/40">Productos y precios de ejemplo.</p>
      </div>

      {/* Cajón del carrito */}
      {open && createPortal(<div className="fixed inset-0 z-[70]">
        <button className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-label="Cerrar carrito" />
        <aside
          className="absolute inset-y-0 right-0 flex w-full max-w-md animate-[slidein_.55s_cubic-bezier(.32,.72,0,1)] flex-col border-l border-gold-500/30 bg-ink-900"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }} role="dialog" aria-label="Carrito de compras"
        >
          <div className="flex items-center justify-between border-b border-gold-500/20 p-5">
            <p className="font-display text-3xl text-gold">Tu carrito</p>
            <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full border border-gold-500/30" aria-label="Cerrar"><X className="size-4" /></button>
          </div>
          <ul className="flex-1 space-y-4 overflow-y-auto p-5">
            {items.length === 0 && <li className="py-16 text-center text-cream/50">Todavía no agregaste productos.</li>}
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-4 rounded-2xl border border-gold-500/20 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/products/${p.id}.webp`} alt="" width={56} height={56} className="size-14 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-xl">{p.name}</p>
                  <p className="text-sm text-gold-200">{money(p.price * cart[p.id])}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => set(p.id, -1)} className="grid size-9 place-items-center rounded-full border border-gold-500/30" aria-label="Quitar uno"><Minus className="size-3.5" /></button>
                  <span className="w-6 text-center tabular-nums">{cart[p.id]}</span>
                  <button onClick={() => set(p.id, 1)} className="grid size-9 place-items-center rounded-full border border-gold-500/30" aria-label="Agregar uno"><Plus className="size-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-4 border-t border-gold-500/20 p-5">
            <div className="flex items-baseline justify-between"><span className="eyebrow">Total</span><span className="font-display text-4xl text-gold">{money(total)}</span></div>
            <a href={items.length ? waLink(order) : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!items.length}
              className={`btn-gold w-full ${items.length ? "" : "pointer-events-none opacity-50"}`}>
              Finalizar por WhatsApp
            </a>
          </div>
        </aside>
      </div>, document.body)}
    </Chapter>
  );
}
