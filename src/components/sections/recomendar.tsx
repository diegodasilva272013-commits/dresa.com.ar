"use client";

import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { Chapter, Head, Bezel } from "@/components/site/chapter";
import { waLink } from "@/lib/site";

function codeFrom(name: string) {
  const clean = name.normalize("NFD").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4).padEnd(4, "X");
  let h = 7;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return `${clean}${String(h).padStart(4, "0")}`;
}

const steps = [
  { t: "Ingresá tu nombre", d: "Generamos tu código personal al instante.", img: "paso-1", alt: "Dos amigas mirando un celular" },
  { t: "Compartí tu enlace", d: "Por WhatsApp o donde prefieras.", img: "paso-2", alt: "Mujer enviando un mensaje desde su sillón" },
  { t: "Sumá a tu red", d: "Cada persona que se registra queda en tu red.", img: "paso-3", alt: "Amigos brindando juntos" },
];

export function Recomendar() {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => (name.trim().length > 1 ? codeFrom(name.trim()) : ""), [name]);
  const link = code ? `${typeof window === "undefined" ? "https://www.dresa.com.ar" : location.origin}/?ref=${code}` : "";
  const msg = `Te recomiendo DRESA: belleza y estilo en tu domicilio. Registrate con mi enlace: ${link}`;

  async function copy() {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }
  async function share() {
    if (navigator.share) { try { await navigator.share({ title: "DRESA", text: msg, url: link }); } catch {} }
    else copy();
  }

  return (
    <Chapter id="recomendar" bg="a" flip pos="70% 50%">
      <Head eyebrow="Recomendar ya" sub="Generá tu enlace personal, envialo a quien quieras y construí tu red DRESA.">
        La belleza se <em className="text-amethyst">comparte.</em>
      </Head>

      <ol className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3 md:gap-6">
        {steps.map((s, i) => (
          <li key={s.t} className="rise">
            <Bezel className="h-full" inner="flex h-full flex-col">
              <div className="relative m-1.5 overflow-hidden rounded-[calc(2rem-.375rem-.375rem)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/services/${s.img}.webp`} alt={s.alt} width={720} height={720} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
              </div>
              <div className="px-6 pb-8 pt-5 text-center">
                <span className="font-display text-5xl leading-none text-gold">{i + 1}</span>
                <p className="mt-3 font-display text-2xl text-cream">{s.t}</p>
                <p className="mx-auto mt-2 max-w-[18rem] text-sm text-cream/65">{s.d}</p>
              </div>
            </Bezel>
          </li>
        ))}
      </ol>

      <Bezel className="rise mx-auto mt-4 max-w-3xl md:mt-6" inner="p-6 sm:p-10">
        <div className="field-wrap">
          <input id="rec-name" value={name} onChange={(e) => setName(e.target.value)} placeholder=" " autoComplete="name" className="field" />
          <label htmlFor="rec-name">Tu nombre</label>
        </div>
        <div className="mt-5 flex min-h-24 flex-col items-center justify-center rounded-2xl border border-dashed border-gold-500/40 bg-ink-950/60 p-5 text-center" aria-live="polite">
          {code ? (
            <>
              <span className="eyebrow">Tu código</span>
              <span className="mt-1 break-all font-display text-5xl tracking-wider text-gold">{code}</span>
              <span className="mt-1 break-all text-xs text-cream/50">{link}</span>
            </>
          ) : (
            <span className="text-sm text-cream/50">Escribí tu nombre para generar tu enlace personal.</span>
          )}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button onClick={copy} disabled={!code} className="btn-ghost !px-4">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copiado" : "Copiar"}
          </button>
          <a
            href={code ? waLink(msg) : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!code}
            className={`btn-gold !px-4 ${code ? "" : "pointer-events-none opacity-50"}`}
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
          <button onClick={share} disabled={!code} className="btn-ghost !px-4">
            <Share2 className="size-4" /> Compartir
          </button>
        </div>
      </Bezel>
    </Chapter>
  );
}
